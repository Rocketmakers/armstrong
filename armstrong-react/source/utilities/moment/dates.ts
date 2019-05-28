import * as moment from "moment";
import { DayOfWeek, IDateParts, IDatePartUtils, IDateType, IDateUtils, IDayUtils, ILocaleUtils, IMonthUtils, IMonthValue, IYearUtils, UnitOfDate } from "../definitions";
import { utils } from "../utils";

function createDateType(native: moment.Moment): IDateType {
  return native as IDateType
}

function getNativeDate(dateType: IDateType): moment.Moment {
  return dateType as moment.Moment
}

function getNativeDateClone(dateType: IDateType): moment.Moment {
  return (dateType as moment.Moment).clone()
}

namespace DateFormats {
  export const DateWireFormat = "YYYY-MM-DD";
}

export class MomentLocaleUtils implements ILocaleUtils {
  private localeSet = false;

  setLocale(locale: string) {
    if (this.localeSet) {
      const previousLocal = moment.locale();
      // tslint:disable-next-line:no-console
      console.warn(`Armstrong locale has already been set to ${previousLocal}, you probably only want to set it once!`);
    }

    moment.locale(locale);
    this.localeSet = true;
  }

  isLocaleSet() { return this.localeSet };
}

export class MomentYearUtils implements IYearUtils {
  generate(settings?: { range?: number, minDate?: string, maxDate?: string, dateFormat?: string }) {
    const range = settings && settings.range || 110
    const format = settings && settings.dateFormat || DateFormats.DateWireFormat
    const currentYear = moment().year()
    const start = settings && settings.minDate ? getNativeDate(MomentDateUtils.parse(settings.minDate, format)).year() : currentYear - range
    const stop = settings && settings.maxDate ? getNativeDate(MomentDateUtils.parse(settings.maxDate, format)).year() : currentYear + range
    return utils.array.range(start, stop + 1)
  }
}

function monthYearCompare(month: number, year: number) {
  return (year * 100) + month
}
export class MomentDayUtils implements IDayUtils {
  getMonthYear(month: number, year: number, settings?: { minDate?: string, maxDate?: string, dateFormat?: string }): number[] {
    const format = settings && settings.dateFormat || DateFormats.DateWireFormat
    let days = MomentDayUtils.dayInMonth(month, year)
    if (settings && settings.minDate) {
      const min = MomentDateUtils.parse(settings.minDate, format)
      if (min.isValid()) {
        const mom = getNativeDate(min)
        const minValue = monthYearCompare(mom.month(), mom.year())
        const value = monthYearCompare(month, year)
        if (value < minValue) {
          days = []
        } else if (minValue === value) {
          days = utils.array.filter(days, d => d >= mom.date())
        }
      }
    }

    if (settings && settings.maxDate) {
      const max = MomentDateUtils.parse(settings.maxDate, format)
      if (max.isValid()) {
        const mom = getNativeDate(max)
        const maxValue = monthYearCompare(mom.month(), mom.year())
        const value = monthYearCompare(month, year)
        if (value > maxValue) {
          days = []
        } else if (maxValue === value) {
          days = utils.array.filter(days, d => d <= mom.date())
        }
      }
    }

    return days
  }

  private static range1to(to: number) {
    return utils.array.range(1, to + 1)
  }

  private static dayInMonth(month: number, year: number): number[] {
    if (utils.object.isNullOrUndefined(month)) {
      return MomentDayUtils.range1to(31)
    }

    const activeMoment = moment([utils.object.isNullOrUndefined(year) ? 2000 : year, month, 1])
    if (!activeMoment.isValid()) {
      return MomentDayUtils.range1to(31)
    }

    return MomentDayUtils.range1to(activeMoment.daysInMonth())
  }
}

export class MomentDatePartUtils implements IDatePartUtils {
  equals(original: Partial<IDateParts>, newValue: Partial<IDateParts>) {
    return original.day === newValue.day && original.month === newValue.month && original.year === newValue.year
  }

  parse(date: string, settings?: { includeDate?: boolean, dateFormat?: string }) {
    const dateFormat = settings && settings.dateFormat || DateFormats.DateWireFormat
    const d = MomentDateUtils.parse(date, dateFormat);
    if (!d.isValid()) {
      return
    }
    const mom = getNativeDate(d)
    const parts: IDateParts & { date?: string } = { day: mom.date(), month: mom.month(), year: mom.year() };
    if (settings && settings.includeDate) {
      parts.date = date
    }
    return parts
  }

  format(dateParts: Partial<IDateParts>, dateFormat?: string) {
    if (!utils.object.isNullOrUndefined(dateParts.day) && !utils.object.isNullOrUndefined(dateParts.month) && !utils.object.isNullOrUndefined(dateParts.year)) {
      const mom = moment([dateParts.year, dateParts.month, dateParts.day]);
      if (mom.isValid()) {
        return mom.format(dateFormat || DateFormats.DateWireFormat)
      }
    }
  }
}

export class MomentMonthUtils implements IMonthUtils {

  getMonthsInYear(year: number, minDate: string, maxDate: string, dateFormat?: string) {
    const format = dateFormat || DateFormats.DateWireFormat
    let monthValues = this.getMonthValues()
    if (minDate) {
      const min = MomentDateUtils.parse(minDate, format)
      const mom = getNativeDate(min)
      if (mom.year() === year) {
        monthValues = utils.array.filter(monthValues, d => d.number >= mom.month())
      }
    }

    if (maxDate) {
      const max = MomentDateUtils.parse(maxDate, format)
      const mom = getNativeDate(max)
      if (mom.year() === year) {
        monthValues = utils.array.filter(monthValues, d => d.number <= mom.month())
      }
    }

    return monthValues
  }

  getMonthValue(dateType: IDateType): IMonthValue {
    if (!dateType || !dateType.isValid()) {
      return
    }

    return MomentMonthUtils.getMonthValueNative(getNativeDate(dateType))
  }

  getMonthValues() {
    return utils.array.range(0, 12).map(i => {
      return MomentMonthUtils.getMonthValueNative(moment().month(i))
    })
  }

  private static getMonthValueNative(mom: moment.Moment): IMonthValue {
    return { number: mom.month(), name: mom.format("MMMM"), shortName: mom.format("MMM") }
  }

}

export class MomentDateUtils implements IDateUtils {
  formats = {
    wireDate: DateFormats.DateWireFormat,
  }

  today() {
    return createDateType(moment().startOf("day"))
  }

  startOf(dateType: IDateType, unitOfTime: UnitOfDate) {
    return createDateType(getNativeDateClone(dateType).startOf(unitOfTime))
  }

  isBefore(dateType: IDateType, minDate: IDateType, unitOfTime: UnitOfDate = "day") {
    const mom = getNativeDate(dateType)
    return mom.isBefore(getNativeDate(minDate), unitOfTime)
  }

  isAfter(dateType: IDateType, maxDate: IDateType, unitOfTime: UnitOfDate = "day") {
    const mom = getNativeDate(dateType)
    return mom.isAfter(getNativeDate(maxDate), unitOfTime)
  }

  fallsWithinRange(dateType: IDateType, minDate: IDateType, maxDate: IDateType) {
    const mom = getNativeDate(dateType)
    if (minDate && minDate.isValid() && mom.isBefore(getNativeDate(minDate), "day")) {
      return false;
    }
    if (maxDate && maxDate.isValid() && mom.isAfter(getNativeDate(maxDate), "day")) {
      return false;
    }
    return true;
  }

  parse(date: string, dateFormat: string): IDateType {
    return MomentDateUtils.parse(date, dateFormat)
  }

  static parse(date: string, dateFormat: string): IDateType {
    return createDateType(moment(date, dateFormat, true))
  }

  parseOrToday(date: string, formatString: string) {
    let dateType = moment(date, formatString, true)
    if (!dateType.isValid()) {
      dateType = moment()
    }
    return createDateType(dateType)
  }

  parseOrUndefined(date: string, formatString: string): IDateType | undefined {
    const dateType = moment(date, formatString, true);
    if (!dateType.isValid()) {
      return;
    }
    return createDateType(dateType)
  }

  get(dateType: IDateType, unitOfTime: UnitOfDate) {
    if (!dateType.isValid()) {
      return
    }

    const mom = getNativeDate(dateType)
    switch (unitOfTime) {
      case "year":
        return mom.year()
      case "month":
        return mom.month()
      case "day":
        return mom.date()
      default:
        const n: never = unitOfTime
        break;
    }
  }

  format(dateType: IDateType, formatString: string) {
    if (!dateType.isValid()) {
      return ""
    }
    return getNativeDate(dateType).format(formatString)
  }

  formatOrEmpty(date: string, formatString: string) {
    const mom = moment(date, formatString, true);
    if (!mom.isValid()) {
      return "";
    }
    return mom.format(formatString)
  }

  add(dateType: IDateType, increment: number, unitOfTime: UnitOfDate) {
    return createDateType(getNativeDateClone(dateType).add(increment, unitOfTime))
  }

  subtract(dateType: IDateType, increment: number, unitOfTime: UnitOfDate) {
    return createDateType(getNativeDateClone(dateType).subtract(increment, unitOfTime))
  }

  getDayOfWeek(dateType: IDateType) {
    if (!dateType.isValid()) {
      return
    }
    return this.format(dateType, "ddd") as DayOfWeek
  }

  isDayOfWeek(dateType: IDateType, dayOfWeek: DayOfWeek) {
    return this.getDayOfWeek(dateType) === dayOfWeek
  }
}
