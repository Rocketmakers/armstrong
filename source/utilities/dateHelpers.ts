import * as moment from "moment";

export class DateHelpers {
  static getDaysArrayByMonth(date: string, month: number): string[] {
    let activeMoment = date ? moment(date, "YYYY-MM-DD") : moment();
    if (month) {
      activeMoment.set("month", month - 1)
    }
    let daysInMonth = activeMoment.daysInMonth();
    return _.range(1,daysInMonth + 1).map(d => d.toString())
  }

  static getDateParts(date: string, includeDate = false){
    let d = moment(date);
    const parts = { day: d.day(), month: d.month(), year: d.year() };
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

  static getYearValues(futureDates: boolean, yearsFromNow = 110){
    return _.range(0,yearsFromNow).map(i => futureDates ? moment().add(i, 'years').year() : moment().subtract(i, 'years').year())
  }

  static toDateFormat(s: {day?: number, month?: number, year?: number}){
    if (s.day && s.month && s.year) {
      return moment().set("day", s.day).set("month", s.month-1).set("year", s.year).format("YYYY-MM-DD")
    }
  }
}