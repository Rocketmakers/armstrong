import assert = require("assert");
import * as moment from "moment";
import { act, renderHook } from "react-hooks-testing-library"
import { IMonth, IUseCalendar, useCalendar } from "../hooks/useCalendar";

function assertResult(result: IUseCalendar, expected: { month: number, year: number, date: string, dateInvalid?: boolean }) {
  assert.equal(result.month.number, expected.month)
  assert.equal(result.month.year, expected.year)
  assert.equal(result.selectedDate, expected.date)
  assert.equal(result.isSelectedDateValid, !expected.dateInvalid)
  assert.equal(result.month.weeks.length, 6)
  for (let week = 0; week < 6; week++) {
    assert.equal(result.month.weeks[week].days.length, 7)
  }
}

function printMonth(month: IMonth) {
  // tslint:disable-next-line: no-console
  console.log(`${month.name} - ${month.year} (${month.shortName} : ${month.number})`);
  for (let week = 0; week < 6; week++) {
    let weekDisplay = ""
    for (let day = 0; day < 7; day++) {
      const d = month.weeks[week].days[day]
      weekDisplay += (d.outOfRange ? "x" : "") + (d.isCurrentDate ? "+" : "") + (!d.isCurrentMonth ? "(" + d.dayNumber + ")" : d.dayNumber) + (d.isToday ? "*" : "") + "|"
    }

    // tslint:disable-next-line: no-console
    console.log(weekDisplay);
  }
  // tslint:disable-next-line: no-console
  console.log()
}

const noDateExpected = { date: "", dateInvalid: true }

function currentYearMonth() {
  return { month: moment().month(), year: moment().year() }
}

describe("useCalendar", () => {
  it("Default Settings", () => {
    const { result } = renderHook(() => useCalendar({}))
    assertResult(result.current, { ...currentYearMonth(), ...noDateExpected })
  })

  it("Default Settings - Min", () => {
    const { result } = renderHook(() => useCalendar({ seedDate: "2019-04-14", minDate: `2019-04-02` }))
    const expected = { month: 3, year: 2019, ...noDateExpected };
    assertResult(result.current, expected)
    // printMonth(result.current.month)
    act(() => result.current.previousMonth())
    assertResult(result.current, expected)
  })

  it("Default Settings - Max", () => {
    const { result } = renderHook(() => useCalendar({ seedDate: "2019-04-14", maxDate: `2019-04-22` }))
    const expected = { month: 3, year: 2019, ...noDateExpected };
    assertResult(result.current, expected)
    // printMonth(result.current.month)
    act(() => result.current.nextMonth())
    assertResult(result.current, expected)
  })

  it("Goto Invalid Date", () => {
    const { result } = renderHook(() => useCalendar({}))
    act(() => result.current.gotoDate("x"))
    assertResult(result.current, { ...currentYearMonth(), ...noDateExpected })
  })

  it("Set Invalid Date", () => {
    const { result } = renderHook(() => useCalendar({}))
    act(() => result.current.selectDate("x"))
    assertResult(result.current, { ...currentYearMonth(), ...noDateExpected })
  })

  it("Invalid Selected Date Settings", () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: "xxxxxx" }))
    assertResult(result.current, { ...currentYearMonth(), ...noDateExpected })
  })

  it("Invalid Seed Date Settings", () => {
    const { result } = renderHook(() => useCalendar({ seedDate: "xxxxxx" }))
    assertResult(result.current, { ...currentYearMonth(), ...noDateExpected })
  })

  it("Alternative format Settings", () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: "31-03-19", format: "DD-MM-YY" }))
    assertResult(result.current, { month: 2, year: 2019, date: "31-03-19" })
  })

  it("Alternative format Settings - Next Month", () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: "31-03-19", format: "DD-MM-YY" }))
    act(() => result.current.nextMonth())
    assertResult(result.current, { month: 3, year: 2019, date: "31-03-19" })
  })

  it("Alternative format Settings - Previous Month", () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: "31-03-19", format: "DD-MM-YY" }))
    act(() => result.current.previousMonth())
    assertResult(result.current, { month: 1, year: 2019, date: "31-03-19" })
  })

  it("Alternative format Settings - Goto Date", () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: "31-03-19", format: "DD-MM-YY" }))
    act(() => result.current.gotoDate("07-11-19"))
    assertResult(result.current, { month: 10, year: 2019, date: "31-03-19" })
  })

  it("Alternative format Settings - Set Date", () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: "31-03-19", format: "DD-MM-YY" }))
    act(() => result.current.selectDate("07-09-19"))
    assertResult(result.current, { month: 8, year: 2019, date: "07-09-19" })
  })

  it("Selected Date Settings out of Min Range", () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: "2019-03-31", minDate: "2019-04-01" }))
    assertResult(result.current, { month: 2, year: 2019, date: "2019-03-31", dateInvalid: true })
  })

  it("Selected Date Settings out of Min Range - Previous Month", () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: "2019-03-31", minDate: "2019-04-01" }))
    act(() => result.current.previousMonth())
    assertResult(result.current, { month: 2, year: 2019, date: "2019-03-31", dateInvalid: true })
  })

  it("Selected Date Settings out of Min Range - Next Month", () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: "2019-03-31", minDate: "2019-04-01" }))
    act(() => result.current.nextMonth())
    assertResult(result.current, { month: 3, year: 2019, date: "2019-03-31", dateInvalid: true })
  })

  it("Selected Date Settings out of Min Range - Set Date before min", () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: "2019-03-31", minDate: "2019-04-01" }))
    act(() => result.current.selectDate("2019-03-01"))
    assertResult(result.current, { month: 2, year: 2019, date: "2019-03-31", dateInvalid: true })
  })

  it("Selected Date Settings out of Min Range - Set Date OK", () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: "2019-03-31", minDate: "2019-04-01" }))
    act(() => result.current.selectDate("2019-04-01"))
    assertResult(result.current, { month: 3, year: 2019, date: "2019-04-01" })
  })

  it("Selected Date Settings out of Max Range", () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: "2019-03-31", maxDate: "2019-03-30" }))
    assertResult(result.current, { month: 2, year: 2019, date: "2019-03-31", dateInvalid: true })
  })

  it("Selected Date Settings out of Max Range - Next Month", () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: "2019-03-31", maxDate: "2019-03-30" }))
    act(() => result.current.nextMonth())
    assertResult(result.current, { month: 2, year: 2019, date: "2019-03-31", dateInvalid: true })
  })

  it("Selected Date Settings out of Max Range - Previous Month", () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: "2019-03-31", maxDate: "2019-03-30" }))
    act(() => result.current.previousMonth())
    assertResult(result.current, { month: 1, year: 2019, date: "2019-03-31", dateInvalid: true })
  })

  it("Selected Date Settings out of Max Range - Set Date After max", () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: "2019-03-31", maxDate: "2019-03-30" }))
    act(() => result.current.selectDate("2019-04-01"))
    assertResult(result.current, { month: 2, year: 2019, date: "2019-03-31", dateInvalid: true })
  })

  it("Selected Date Settings out of Max Range - Set Date OK", () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: "2019-01-31", maxDate: "2019-03-30" }))
    act(() => result.current.selectDate("2019-03-30"))
    assertResult(result.current, { month: 2, year: 2019, date: "2019-03-30" })
  })

  it("Selected Date Settings", () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: "2019-03-31" }))
    assertResult(result.current, { month: 2, year: 2019, date: "2019-03-31" })
  })

  it("Selected Date Settings - Next Month", () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: "2019-03-31" }))
    act(() => result.current.nextMonth())
    assertResult(result.current, { month: 3, year: 2019, date: "2019-03-31" })
  })

  it("Selected Date Settings - Previous Month", () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: "2019-03-31" }))
    act(() => result.current.previousMonth())
    assertResult(result.current, { month: 1, year: 2019, date: "2019-03-31" })
  })

  it("Selected Date Settings - Goto Date", () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: "2019-03-31" }))
    act(() => result.current.gotoDate("2019-11-07"))
    assertResult(result.current, { month: 10, year: 2019, date: "2019-03-31" })
  })

  it("Selected Date Settings - Set Date", () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: "2019-03-31" }))
    act(() => result.current.selectDate("2019-09-07"))
    assertResult(result.current, { month: 8, year: 2019, date: "2019-09-07" })
  })

  it("Selected Date Settings - Next Year", () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: "2019-03-31" }))
    act(() => result.current.nextYear())
    assertResult(result.current, { month: 2, year: 2020, date: "2019-03-31" })
  })

  it("Selected Date Settings - Previous Year", () => {
    const { result } = renderHook(() => useCalendar({ selectedDate: "2019-03-31" }))
    act(() => result.current.previousYear())
    assertResult(result.current, { month: 2, year: 2018, date: "2019-03-31" })
  })
})
