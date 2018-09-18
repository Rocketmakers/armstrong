import * as moment from "moment";
import * as _ from "underscore";
import { Formatting } from "./formatting";

function range1to(to: number) {
  return _.range(1, to + 1).map(d => d.toString())
}
export class DateHelpers {
  // Date helpers
  static getDaysArrayByMonth(month: number, year: number): string[] {
    if (Formatting.isNullOrUndefined(month)) {
      return range1to(31)
    }
    if (Formatting.isNullOrUndefined(year)) {
      year = 2000
    }
    const activeMoment = moment([year, month - 1, 1])
    if (!activeMoment.isValid()) {
      return range1to(31)
    }
    return range1to(activeMoment.daysInMonth())
  }

  static getDateParts(date: string, includeDate = false) {
    const d = moment(date, "YYYY-MM-DD", true);
    const parts: { day: number, month: number, year: number, date?: string } = { day: d.date(), month: d.month() + 1, year: d.year() };
    if (includeDate) {
      parts.date = date
    }
    return parts
  }

  static areSame(d1: string, d2: string) {
    return moment(d1).isSame(moment(d2))
  }

  static getMonthValues() {
    return _.range(0, 12).map(i => {
      const month = moment().month(i)
      return { value: month.format("M"), label: month.format("MMMM") }
    })
  }

  static isBefore(date1: string, date2: string, granularity?: string): boolean {
    const d1 = moment(date1, "YYYY-MM-DD", true);
    const d2 = moment(date2, "YYYY-MM-DD", true);

    return d1.isBefore(d2);
  }

  static isAfter(date1: string, date2: string, granularity?: string): boolean {
    const d1 = moment(date1, "YYYY-MM-DD", true);
    const d2 = moment(date2, "YYYY-MM-DD", true);

    return d1.isBefore(d2);
  }

  static isEndOfMonth(date: string): boolean {
    const endOfMonth = moment(date).endOf("month");
    return endOfMonth.isSame(date, "day");
  }

  static getYearValues(futureDates: boolean, yearsFromNow = 110, startCap = 0) {
    const r = _.range(0, yearsFromNow).map(i => futureDates ? moment().add(i, "years").year() : moment().subtract(i, "years").year());
    if (startCap) {
      return futureDates ? _.reject(r, v => v < startCap) : _.reject(r, v => v > startCap);
    }
    return r;
  }

  static toDateFormat(s: { day?: number, month?: number, year?: number }) {
    if (s.day && s.month && s.year) {
      const mom = moment([s.year, s.month - 1, s.day]);
      if (mom.isValid()) {
        return mom.format("YYYY-MM-DD")
      }
    }
  }

  // Time helpers
  static getTimeParts(time: string) {
    const d = moment(time, "HH:mm", false);
    return { hours: d.hour(), minutes: d.minute() };
  }
}
