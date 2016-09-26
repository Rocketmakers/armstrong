import * as moment from "moment";
import * as _ from "underscore";

export class DateHelpers {
  // Date helpers
  static getDaysArrayByMonth(date: string, month: number): string[] {
    let activeMoment = date ? moment(date, "YYYY-MM-DD", true) : moment();
    if (month) {
      activeMoment.set("month", month - 1)
    }
    let daysInMonth = activeMoment.daysInMonth();
    return _.range(1,daysInMonth + 1).map(d => d.toString())
  }

  static getDateParts(date: string, includeDate = false){
    let d = moment(date, "YYYY-MM-DD", true);
    const parts = { day: d.date(), month: d.month()+1, year: d.year() };
    if (includeDate) {
        parts["date"] = date
    }
    return parts
  }

  static areSame(d1: string, d2: string){
    return moment(d1).isSame(moment(d2))
  }

  static getMonthValues(){
    return _.range(0,12).map(i => {
      var month = moment().month(i)
      return {value: month.format("M"), label: month.format("MMMM") }
    })
  }

  static isBefore(date1: string, date2: string, granularity?: string) : boolean{
    let d1 = moment(date1, "YYYY-MM-DD", true);
    let d2 = moment(date2, "YYYY-MM-DD", true);

    return d1.isBefore(d2);
  }

  static isAfter(date1: string, date2: string, granularity?: string) : boolean{
    let d1 = moment(date1, "YYYY-MM-DD", true);
    let d2 = moment(date2, "YYYY-MM-DD", true);

    return d1.isBefore(d2);
  }

  static isEndOfMonth(date: string) : boolean{
    const endOfMonth = moment(date).endOf('month');
    return endOfMonth.isSame(date, 'day');
  }

  static getYearValues(futureDates: boolean, yearsFromNow = 110){
    return _.range(0,yearsFromNow).map(i => futureDates ? moment().add(i, 'years').year() : moment().subtract(i, 'years').year())
  }

  static toDateFormat(s: {day?: number, month?: number, year?: number}){
    if (s.day && s.month && s.year) {
      return moment().set("day", s.day).set("month", s.month-1).set("year", s.year).format("YYYY-MM-DD")
    }
  }

  // Time helpers
  static getTimeParts(time: string){
    let d = moment(time, "HH:mm", true);
    return { hours: d.hour(), minutes: d.minute() };
  }
}