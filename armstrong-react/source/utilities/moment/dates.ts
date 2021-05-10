import { DayOfWeek, IDateParts, IDatePartUtils, IDateUtils, IDayUtils, ILocaleUtils, IMonthUtils, IMonthValue, IYearUtils, UnitOfDate } from "../definitions";
import { utils } from "../utils";
import { parse, startOfDay, isValid, format, getMonth, setMonth, getDate, getDaysInMonth, getYear, startOfMonth, startOfYear, isBefore, addDays, addMonths, addYears, subDays, subMonths, subYears, isAfter } from 'date-fns';
import { enGB } from 'date-fns/locale';

namespace DateFormats {
  export const DateWireFormat = "yyyy-MM-dd";
}

export class MomentLocaleUtils implements ILocaleUtils {
  private localeSet = false;

  setLocale(locale: string) {
    console.warn(`Date FNS does not support setting a default locale`);
  }

  isLocaleSet() { return this.localeSet };
}

export class MomentYearUtils implements IYearUtils {
  generate(settings?: { range?: number, minDate?: string, maxDate?: string, dateFormat?: string }) {
    const range = settings && settings.range || 110
    const format = settings && settings.dateFormat || DateFormats.DateWireFormat
    const currentYear = getYear(new Date());
    const start = settings && settings.minDate ? getYear(parse(settings.minDate, format, new Date())) : currentYear - range
    const stop = settings && settings.maxDate ? getYear(parse(settings.maxDate, format, new Date())) : currentYear + range
    return utils.array.range(start, stop + 1)
  }
}

function monthYearCompare(month: number, year: number) {
  return (year * 100) + month
}
export class MomentDayUtils implements IDayUtils {

  private locale: Locale;
  constructor() {
    this.locale = enGB;    
  }

  getMonthYear(month: number, year: number, settings?: { minDate?: string, maxDate?: string, dateFormat?: string }): number[] {
    const format = settings && settings.dateFormat || DateFormats.DateWireFormat
    let days = MomentDayUtils.dayInMonth(month, year)
    if (settings && settings.minDate) {
      const min = parse(settings.minDate, format, new Date())
      if (isValid(min)) {
        const minValue = monthYearCompare(getMonth(min), getYear(min));
        const value = monthYearCompare(month, year)
        if (value < minValue) {
          days = []
        } else if (minValue === value) {
          days = utils.array.filter(days, d => d >= getDate(min))
        }
      }
    }

    if (settings && settings.maxDate) {
      const max = parse(settings.maxDate, format, new Date())
      if (isValid(max)) {
        const maxValue = monthYearCompare(getMonth(max), getYear(max))
        const value = monthYearCompare(month, year)
        if (value > maxValue) {
          days = []
        } else if (maxValue === value) {
          days = utils.array.filter(days, d => d <= getDate(max))
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

    const activeDate = new Date(year || 2000, month, 1);
    
    if (!isValid(activeDate)) {
      return MomentDayUtils.range1to(31)
    }

    return MomentDayUtils.range1to(getDaysInMonth(activeDate))
  }
}


export class MomentMonthUtils implements IMonthUtils {

  private locale: Locale;
  constructor() {
    this.locale = enGB;    
  }


  getMonthsInYear(year: number, minDate: string, maxDate: string, dateFormat?: string) {
    const format = dateFormat || DateFormats.DateWireFormat
    let monthValues = this.getMonthValues()
    if (minDate) {
      const min = parse(minDate, format, new Date())
      // const mom = getNativeDate(min)
      if (getYear(min) === year) {
        monthValues = utils.array.filter(monthValues, d => d.number >= getMonth(min))
      }
    }

    if (maxDate) {
      const max = parse(maxDate, format, new Date())
      if (getYear(max) === year) {
        monthValues = utils.array.filter(monthValues, d => d.number <= getMonth(max))
      }
    }

    return monthValues
  }

  getMonthValue(date: Date): IMonthValue {
    if (!date || !isValid(date)) {
      return
    }

    return this.getMonthValueNative(date);
  }

  getMonthValues() {
    return utils.array.range(0, 12).map(i => {
      return this.getMonthValueNative(setMonth(new Date(), i));
    })
  }

  getMonthValueNative(date: Date): IMonthValue {
    return { number: getMonth(date), name: format(date, "MMMM", { locale: this.locale }), shortName: format(date, "MMM", { locale: this.locale }) }
  }

}
export class MomentDatePartUtils implements IDatePartUtils {

  private locale: Locale;
  constructor() {
    this.locale = enGB;    
  }

  equals(original: Partial<IDateParts>, newValue: Partial<IDateParts>) {
    return original.day === newValue.day && original.month === newValue.month && original.year === newValue.year
  }

  parse(date: string, settings?: { includeDate?: boolean, dateFormat?: string }) {
    const dateFormat = settings && settings.dateFormat || DateFormats.DateWireFormat
    const d = parse(date, dateFormat, new Date());
    if (!isValid(d)) {
      return
    }
    const parts: IDateParts & { date?: string } = { day: getDate(d), month: getMonth(d), year: getYear(d) };
    if (settings && settings.includeDate) {
      parts.date = date
    }
    return parts
  }

  format(dateParts: Partial<IDateParts>, dateFormat?: string) {
    if (!utils.object.isNullOrUndefined(dateParts.day) && !utils.object.isNullOrUndefined(dateParts.month) && !utils.object.isNullOrUndefined(dateParts.year)) {
      const mom = new Date(dateParts.year, dateParts.month, dateParts.day);
      if (isValid(mom)) {
        return format(mom, dateFormat || DateFormats.DateWireFormat, { locale: this.locale })
      }
    }
  }
}


export class MomentDateUtils implements IDateUtils {

  private locale: Locale;
  constructor() {
    this.locale = enGB;    
  }

  parse(date: string, dateFormat: string, locale: Locale): Date {
   return parse(date, dateFormat, new Date());
  }
  formats = {
    wireDate: DateFormats.DateWireFormat,
  }

  today() {
    return startOfDay(new Date());
  }

  startOf(date: Date, unitOfTime: UnitOfDate) {
    switch (unitOfTime) {
      case 'day':
        return startOfDay(date);
      case 'month':
        return startOfMonth(date);
      case 'year':
        return startOfYear(date);
      default:
        break;
    }
  }

  isBefore(date: Date, minDate: Date, unitOfTime: UnitOfDate = "day") {
    const start = this.startOf(date, unitOfTime);
    const min = this.startOf(minDate, unitOfTime);
    return isBefore(start, min)
  }

  isAfter(date: Date, maxDate: Date, unitOfTime: UnitOfDate = "day") {
    const start = this.startOf(date, unitOfTime);
    const max = this.startOf(maxDate, unitOfTime);
    return isAfter(start, max)
  }

  fallsWithinRange(date: Date, minDate: Date, maxDate: Date) {

    if (minDate && isValid(minDate) && this.isBefore(date, minDate, "day")) {
      return false;
    }
    if (maxDate && isValid(maxDate) && this.isAfter(date, maxDate, "day")) {
      return false;
    }
    return true;
  }

  parseOrToday(date: string, formatString: string) {
    if (!date){
      return new Date();
    }
    let d = parse(date, formatString, new Date());
    if (!isValid(d)) {
      d = new Date();
    }
    return d;
  }

  parseOrUndefined(date: string, formatString: string): Date | undefined {
    if (!date){
      return;
    }
    const d = parse(date, formatString, new Date());
    if (!isValid(d)) {
      return;
    }
    return d;
  }

  get(date: Date, unitOfTime: UnitOfDate) {
    if (!isValid(date)) {
      return
    }

    switch (unitOfTime) {
      case "year":
        return getYear(date);
      case "month":
        return getMonth(date);
      case "day":
        return getDate(date);
      default:
        throw new Error("Unsupported unit of time");
    }
  }

  format(date: Date, formatString: string, locale?: Locale) {
    if (!date || !isValid(date)) {
      return ""
    }
    return format(date, formatString, { locale: locale || this.locale });
  }

  formatOrEmpty(date: string, formatString: string, locale?: Locale) {
    if (!date){
      return "";
    }
    const d = parse(date, formatString, new Date());
    if (!isValid(d)) {
      return "";
    }
    return format(d, formatString, { locale: locale || this.locale });
  }

  add(date: Date, increment: number, unitOfTime: UnitOfDate) {
    let d;
    switch (unitOfTime) {
      case 'day':
        d = addDays(date, increment);        
        break;
      case 'month':
        d = addMonths(date, increment);
        break;    
      case 'year':
        d = addYears(date, increment);
        break;
      default:
        throw new Error(`Unsupported unitoftime provided ${unitOfTime}`);
    }
    return d;
  }

  subtract(date: Date, decrement: number, unitOfTime: UnitOfDate) {
    let d;
    switch (unitOfTime) {
      case 'day':
        d = subDays(date, decrement);        
        break;
      case 'month':
        d = subMonths(date, decrement);
        break;    
      case 'year':
        d = subYears(date, decrement);
        break;
      default:
        throw new Error(`Unsupported unitoftime provided ${unitOfTime}`);
    }
    return d;
  }

  getDayOfWeek(date: Date) {
    if (!date || !isValid(date)) {
      return
    }
    return this.format(date, "iii") as DayOfWeek
  }

  isDayOfWeek(date: Date, dayOfWeek: DayOfWeek) {
    return this.getDayOfWeek(date) === dayOfWeek
  }
}
