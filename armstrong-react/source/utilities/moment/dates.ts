import * as moment from "moment";
import { DayOfWeek, IDateParts, IDatePartUtils, IDateTimeType, IDateUtils, IDayUtils, IMonthUtils, IMonthValue, IYearUtils, UnitOfTime } from "../definitions";
import { utils } from "../utils";

function createDateType(native: moment.Moment): IDateTimeType {
  return native as IDateTimeType
}

function getNativeDate(dateType: IDateTimeType): moment.Moment {
  return dateType as moment.Moment
}

function getNativeDateClone(dateType: IDateTimeType): moment.Moment {
  return (dateType as moment.Moment).clone()
}

export namespace DateFormats {
  export const DateWireFormat = "YYYY-MM-DD";
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

export class MomentDayUtils implements IDayUtils {
  inMonthYear(month: number, year: number, settings?: { minDate?: string, maxDate?: string, dateFormat?: string }): number[] {
    const format = settings && settings.dateFormat || DateFormats.DateWireFormat
    let days = MomentDayUtils.dayInMonth(month, year)
    if (settings && settings.minDate) {
      const min = MomentDateUtils.parse(settings.minDate, format)
      const mom = getNativeDate(min)
      if (mom.year() === year && mom.month() === month) {
        days = utils.array.filter(days, d => d >= mom.date())
      }
    }

    if (settings && settings.maxDate) {
      const max = MomentDateUtils.parse(settings.maxDate, format)
      const mom = getNativeDate(max)
      if (mom.year() === year && mom.month() === month) {
        days = utils.array.filter(days, d => d <= mom.date())
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

    if (utils.object.isNullOrUndefined(year)) {
      year = 2000
    }

    const activeMoment = moment([year, month, 1])
    if (!activeMoment.isValid()) {
      return MomentDayUtils.range1to(31)
    }

    return MomentDayUtils.range1to(activeMoment.daysInMonth())
  }
}

export class MomentDatePartUtils implements IDatePartUtils {
  haveChanged(newState: Partial<IDateParts>, dateState: Partial<IDateParts>) {
    return newState.day !== dateState.day || newState.month !== dateState.month || newState.year !== dateState.year
  }

  parse(date: string, settings?: { includeDate?: boolean, dateFormat?: string }) {
    const dateFormat = settings && settings.dateFormat || DateFormats.DateWireFormat
    const d = MomentDateUtils.parse(date, dateFormat);
    const mom = getNativeDate(d)
    const parts: IDateParts & { date?: string } = { day: mom.date(), month: mom.month(), year: mom.year() };
    if (settings && settings.includeDate) {
      parts.date = date
    }
    return parts
  }

  format(dateParts: Partial<IDateParts>, dateFormat?: string) {
    if (!utils.object.isNullOrUndefined(dateParts.day) && !utils.object.isNullOrUndefined(dateParts.month) && !utils.object.isNullOrUndefined(dateParts.year)) {
      const dateType = moment([dateParts.year, dateParts.month, dateParts.day]);
      if (dateType.isValid()) {
        return dateType.format(dateFormat || DateFormats.DateWireFormat)
      }
    }
  }
}

export class MomentMonthUtils implements IMonthUtils {

  getMonthsInYear(year: number, settings?: { minDate?: string, maxDate?: string, dateFormat?: string }) {
    const format = settings && settings.dateFormat || DateFormats.DateWireFormat
    let monthValues = this.getMonthValues()
    if (settings && settings.minDate) {
      const min = MomentDateUtils.parse(settings.minDate, format)
      const mom = getNativeDate(min)
      if (mom.year() === year) {
        monthValues = utils.array.filter(monthValues, d => d.number >= mom.month())
      }
    }

    if (settings && settings.maxDate) {
      const max = MomentDateUtils.parse(settings.maxDate, format)
      const mom = getNativeDate(max)
      if (mom.year() === year) {
        monthValues = utils.array.filter(monthValues, d => d.number <= mom.month())
      }
    }

    return monthValues
  }

  getMonthValue(dateType: IDateTimeType): IMonthValue {
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

  now() {
    return createDateType(moment())
  }

  today() {
    return createDateType(moment().startOf("day"))
  }

  startOf(dateType: IDateTimeType, unitOfTime: UnitOfTime) {
    return createDateType(getNativeDateClone(dateType).startOf(unitOfTime))
  }

  isBefore(dateType: IDateTimeType, minDate: IDateTimeType, unitOfTime: UnitOfTime = "day") {
    const mom = getNativeDate(dateType)
    return mom.isBefore(getNativeDate(minDate), unitOfTime)
  }

  isAfter(dateType: IDateTimeType, maxDate: IDateTimeType, unitOfTime: UnitOfTime = "day") {
    const mom = getNativeDate(dateType)
    return mom.isAfter(getNativeDate(maxDate), unitOfTime)
  }

  fallsWithinRange(dateType: IDateTimeType, minDate: IDateTimeType, maxDate: IDateTimeType) {
    const mom = getNativeDate(dateType)
    if (minDate && mom.isBefore(getNativeDate(minDate), "day")) {
      return false;
    }
    if (maxDate && mom.isAfter(getNativeDate(maxDate), "day")) {
      return false;
    }
    return true;
  }

  parse(date: string, dateFormat: string): IDateTimeType {
    return MomentDateUtils.parse(date, dateFormat)
  }

  static parse(date: string, dateFormat: string): IDateTimeType {
    return createDateType(moment(date, dateFormat, true))
  }

  parseOrToday(date: string, formatString: string) {
    let dateType = moment(date, formatString, true)
    if (!dateType.isValid()) {
      dateType = moment()
    }
    return createDateType(dateType)
  }

  parseOrUndefined(date: string, formatString: string): IDateTimeType | undefined {
    const dateType = moment(date, formatString, true);
    if (!dateType.isValid()) {
      return;
    }
    return createDateType(dateType)
  }

  get(dateType: IDateTimeType, unitOfTime: UnitOfTime) {
    const mom = getNativeDate(dateType)
    switch (unitOfTime) {
      case "year":
        return mom.year()
      case "month":
        return mom.month()
      case "day":
        return mom.date()
      case "hour":
        return mom.hour()
      case "minute":
        return mom.minute()
      case "second":
        return mom.second()

      default:
        const n: never = unitOfTime
        break;
    }
  }

  format(dateType: IDateTimeType, formatString: string) {
    return getNativeDate(dateType).format(formatString)
  }

  formatOrEmpty(date: string, formatString: string) {
    const mom = moment(date, formatString, true);
    if (!mom.isValid()) {
      return "";
    }
    return mom.format(formatString)
  }

  add(dateType: IDateTimeType, increment: number, unitOfTime: UnitOfTime) {
    return createDateType(getNativeDateClone(dateType).add(increment, unitOfTime))
  }

  subtract(dateType: IDateTimeType, increment: number, unitOfTime: UnitOfTime) {
    return createDateType(getNativeDateClone(dateType).subtract(increment, unitOfTime))
  }

  getDayOfWeek(dateType: IDateTimeType) {
    return this.format(dateType, "ddd") as DayOfWeek
  }

  isDayOfWeek(dateType: IDateTimeType, dayOfWeek: DayOfWeek) {
    return this.getDayOfWeek(dateType) === dayOfWeek
  }
}
