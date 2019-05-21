import * as moment from "moment";
import * as _ from "underscore";
import { Formatting } from "./formatting";

export type DateType = moment.Moment
export type DayOfWeek = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat"

export interface IDateParts {
  day: number
  month: number
  year: number
}

export namespace Dates {

  function range1to(to: number) {
    return _.range(1, to + 1).map(d => d)
  }

  export function getDaysArrayByMonth(month: number, year: number, minDate: string, maxDate: string): number[] {
    let days = dayInMonth(month, year)
    if (minDate) {
      const min = parseWireFormatDate(minDate)
      if (min.year() === year && min.month() === month) {
        days = days.filter(d => d >= min.date())
      }
    }

    if (maxDate) {
      const max = parseWireFormatDate(maxDate)
      if (max.year() === year && max.month() === month) {
        days = days.filter(d => d <= max.date())
      }
    }

    return days
  }

  function dayInMonth(month: number, year: number): number[] {
    if (Formatting.isNullOrUndefined(month)) {
      return range1to(31)
    }

    if (Formatting.isNullOrUndefined(year)) {
      year = 2000
    }

    const activeMoment = moment([year, month, 1])
    if (!activeMoment.isValid()) {
      return range1to(31)
    }

    return range1to(activeMoment.daysInMonth())
  }

  export function parseWireFormatDate(date: string) {
    return moment(date, "YYYY-MM-DD", true)
  }

  export function getDateParts(date: string, includeDate = false) {
    const d = parseWireFormatDate(date);
    const parts: IDateParts & { date?: string } = { day: d.date(), month: d.month(), year: d.year() };
    if (includeDate) {
      parts.date = date
    }
    return parts
  }

  export function toDateFormat(s: Partial<IDateParts>) {
    if (!Formatting.isNullOrUndefined(s.day) && !Formatting.isNullOrUndefined(s.month) && !Formatting.isNullOrUndefined(s.year)) {
      const mom = moment([s.year, s.month, s.day]);
      if (mom.isValid()) {
        return mom.format("YYYY-MM-DD")
      }
    }
  }

  export function getYearValues(minDate: string, maxDate: string, range = 110) {
    const start = minDate ? parseWireFormatDate(minDate).year() : moment().subtract(range, "years").year()
    const stop = maxDate ? parseWireFormatDate(maxDate).year() : moment().add(range, "years").year()
    return _.range(start, stop + 1)
  }

  export function getMonthValuesInRange(year: number, minDate: string, maxDate: string) {
    let months = getMonthValues()
    if (minDate) {
      const min = parseWireFormatDate(minDate)
      if (min.year() === year) {
        months = months.filter(d => d.value >= min.month())
      }
    }

    if (maxDate) {
      const max = parseWireFormatDate(maxDate)
      if (max.year() === year) {
        months = months.filter(d => d.value <= max.month())
      }
    }

    return months
  }

  export function getMonthValues() {
    return _.range(0, 12).map(i => {
      const month = moment().month(i)
      return { value: i, label: month.format("MMMM") }
    })
  }

  export function startOfToday() {
    return moment().startOf("day")
  }

  export function fallsWithinRange(mom: DateType, minDate: DateType, maxDate: DateType) {
    if (minDate && mom.isBefore(minDate, "day")) {
      return false;
    }
    if (maxDate && mom.isAfter(maxDate, "day")) {
      return false;
    }
    return true;
  }

  export function dateOrToday(date: string, formatString: string) {
    const mom = moment(date, formatString, true);
    if (!mom.isValid()) {
      return moment();
    }
    return mom
  }

  export function dateOrEmpty(date: string, formatString: string) {
    const mom = moment(date, formatString, true);
    if (!mom.isValid()) {
      return "";
    }
    return mom.format(formatString)
  }

  export function dateOrNull(date: string, formatString: string) {
    const mom = moment(date, formatString, true);
    if (!mom.isValid()) {
      return;
    }
    return mom
  }

  export function startOfMonth(mom: DateType) {
    return mom.clone().startOf("month")
  }

  export function getMonth(mom: DateType) {
    return mom.month()
  }

  export function getDayNumber(mom: DateType) {
    return mom.date()
  }

  export function getYear(mom: DateType) {
    return mom.year()
  }

  export function format(mom: DateType, formatString: string) {
    return mom.format(formatString)
  }

  export function addMonth(mom: DateType, increment: number) {
    return mom.clone().add(increment, "month")
  }

  export function addDay(mom: DateType, increment: number) {
    return mom.add(increment, "day")
  }

  export function getDayOfWeek(mom: DateType) {
    return mom.format("ddd") as DayOfWeek
  }

  export function isDayOfWeek(mom: DateType, dayOfWeek: DayOfWeek) {
    return getDayOfWeek(mom) === dayOfWeek
  }
}
