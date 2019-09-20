import assert = require("assert");
import * as moment from "moment";
import { calendarUtils } from "../utilities/calendarUtils";
import { utils } from "../utilities/utils";

describe("calendarUtils.year", () => {
  it("Range", () => {
    const years = calendarUtils.year.generate({ range: 2 })
    const currentYear = moment().year()
    assert(years.length === 5, "Should have 5 years")
    assert(years[0] === currentYear - 2, "Should have min year of currentYear - 2")
    assert(years[4] === currentYear + 2, "Should have min year of currentYear + 2")
  })

  it("Min", () => {
    const currentYear = moment().year()
    const years = calendarUtils.year.generate({ range: 2, minDate: `${currentYear}-01-01` })
    assert(years.length === 3, "Should have 3 years")
    assert(years[0] === currentYear, "Should have min year of currentYear")
    assert(years[2] === currentYear + 2, "Should have min year of currentYear + 2")
  })

  it("Max", () => {
    const currentYear = moment().year()
    const years = calendarUtils.year.generate({ range: 2, maxDate: `${currentYear}-01-01` })
    assert(years.length === 3, "Should have 3 years")
    assert(years[0] === currentYear - 2, "Should have min year of currentYear - 2")
    assert(years[2] === currentYear, "Should have min year of currentYear")
  })
  it("Min + Max", () => {
    const currentYear = moment().year()
    const years = calendarUtils.year.generate({ range: 2, minDate: `${currentYear}-01-01`, maxDate: `${currentYear}-12-31` })
    assert(years.length === 1, "Should have 1 years")
    assert(years[0] === currentYear, "Should have year of currentYear")
  })
})

describe("calendarUtils.month", () => {
  it("getMonthValue", () => {
    const date = calendarUtils.date.parse("2019-11-30", calendarUtils.date.formats.wireDate)
    const monthValue = calendarUtils.month.getMonthValue(date)
    assert(monthValue.number === 10, "Should have month of 10")
    assert(monthValue.name === "November", "Should have name of November")
    assert(monthValue.shortName === "Nov", "Should have short name of Nov")
  })

  it("getMonthValue - Invalid date", () => {
    const date = calendarUtils.date.parse("xxx", calendarUtils.date.formats.wireDate)
    const monthValue = calendarUtils.month.getMonthValue(date)
    assert(monthValue === undefined, "Should have undefined value")
  })

  it("getMonthValues", () => {
    const monthValues = calendarUtils.month.getMonthValues()
    assert(monthValues.length === 12, "Should have 12 values")
    assert(monthValues[0].number === 0, "Should have first month of 0")
    assert(monthValues[11].number === 11, "Should have last month of 11")
  })

  it("getMonthsInYear", () => {
    const currentYear = moment().year()
    const monthValues = calendarUtils.month.getMonthsInYear(currentYear, undefined, undefined)
    assert(monthValues.length === 12, "Should have 12 values")
  })

  it("getMonthsInYear - Min", () => {
    const currentYear = moment().year()
    const monthValues = calendarUtils.month.getMonthsInYear(currentYear, `${currentYear}-03-01`, undefined)
    assert(monthValues.length === 10, "Should have 10 values")
    assert(monthValues[0].number === 2, "Should have first month of 2")
    assert(monthValues[9].number === 11, "Should have last month of 11")
  })

  it("getMonthsInYear - Max", () => {
    const currentYear = moment().year()
    const monthValues = calendarUtils.month.getMonthsInYear(currentYear, undefined, `${currentYear}-03-01`)
    assert(monthValues.length === 3, "Should have 3 values")
    assert(monthValues[0].number === 0, "Should have first month of 0")
    assert(monthValues[2].number === 2, "Should have last month of 2")
  })
})

function assertNovember(days: number[]) {
  assert(days.length === 30, "Should have 30 days in Nov")
  assert(days[0] === 1, "Should have day 1 first")
  assert(days[29] === 30, "Should have day 30 last")

}
describe("calendarUtils.day", () => {
  it("getMonthYear", () => {
    const days = calendarUtils.day.getMonthYear(10, 2019)
    assertNovember(days)
  })

  it("getMonthYear - Min In Month", () => {
    const days = calendarUtils.day.getMonthYear(10, 2019, { minDate: "2019-11-30" })
    assert(days.length === 1, "Should have 1 day")
    assert(days[0] === 30, "Should have day 30 first")
  })

  it("getMonthYear - Min After Month", () => {
    const days = calendarUtils.day.getMonthYear(10, 2019, { minDate: "2019-12-30" })
    assert(days.length === 0, "Should have 0 days")
  })

  it("getMonthYear - Min Before Month", () => {
    const days = calendarUtils.day.getMonthYear(10, 2019, { minDate: "2019-10-30" })
    assertNovember(days)
  })

  it("getMonthYear - Max in Month", () => {
    const days = calendarUtils.day.getMonthYear(10, 2019, { maxDate: "2019-11-01" })
    assert(days.length === 1, "Should have 1 day")
    assert(days[0] === 1, "Should have day 1 first")
  })

  it("getMonthYear - Max After Month", () => {
    const days = calendarUtils.day.getMonthYear(10, 2019, { maxDate: "2019-12-30" })
    assertNovember(days)
  })

  it("getMonthYear - Max Before Month", () => {
    const days = calendarUtils.day.getMonthYear(10, 2019, { maxDate: "2019-10-30" })
    assert(days.length === 0, "Should have 0 days")
  })
})

describe("calendarUtils.date", () => {
  it("today", () => {
    const today = calendarUtils.date.today()
    assert(today.isValid(), "Should get today as valid value")
  })

  it("parse/format", () => {
    const parseDate = "2020-03-19"
    const parsed = calendarUtils.date.parse(parseDate, calendarUtils.date.formats.wireDate)
    assert(parsed.isValid(), "Should get a valid value")
    const format = calendarUtils.date.format(parsed, calendarUtils.date.formats.wireDate)
    assert(format === parseDate, "Should get back same value")
  })

  it("parse/format - invalid", () => {
    const parseDate = "202x-03-19"
    const parsed = calendarUtils.date.parse(parseDate, calendarUtils.date.formats.wireDate)
    assert(!parsed.isValid(), "Should get an invalid value")
    const format = calendarUtils.date.format(parsed, calendarUtils.date.formats.wireDate)
    assert(format === "", "Should get back empty value")
  })

  it("parseOrUndefined", () => {
    const parseDate = "2020-03-19"
    const parsed = calendarUtils.date.parseOrUndefined(parseDate, calendarUtils.date.formats.wireDate)
    assert(parsed.isValid(), "Should get back valid value")
  })

  it("parseOrUndefined - invalid", () => {
    const parseDate = "202x-03-19"
    const parsed = calendarUtils.date.parseOrUndefined(parseDate, calendarUtils.date.formats.wireDate)
    assert(parsed === undefined, "Should get back 'undefined'")
  })

  it("parseOrToday", () => {
    const parseDate = "2020-03-19"
    const parsed = calendarUtils.date.parseOrToday(parseDate, calendarUtils.date.formats.wireDate)
    assert(parsed.isValid(), "Should get back valid value")
    const format = calendarUtils.date.format(parsed, calendarUtils.date.formats.wireDate)
    assert(format === parseDate, "Should get back same value")
  })

  it("parseOrToday - invalid", () => {
    const parseDate = "202x-03-19"
    const parsed = calendarUtils.date.parseOrToday(parseDate, calendarUtils.date.formats.wireDate)
    assert(parsed.isValid(), "Should get back valid value")
    const format = calendarUtils.date.format(parsed, calendarUtils.date.formats.wireDate)
    const today = calendarUtils.date.format(calendarUtils.date.today(), calendarUtils.date.formats.wireDate)
    assert(format === today, "Should get back today")
  })

  it("formatOrEmpty", () => {
    const parseDate = "2020-03-19"
    const format = calendarUtils.date.formatOrEmpty(parseDate, calendarUtils.date.formats.wireDate)
    assert(format === parseDate, "Should get back same value")
  })

  it("formatOrEmpty - Invalid date", () => {
    const parseDate = "202x-03-19"
    const format = calendarUtils.date.formatOrEmpty(parseDate, calendarUtils.date.formats.wireDate)
    assert(format === "", "Should get back empty value")
  })

  it("get", () => {
    const parseDate = "2020-03-19"
    const parsed = calendarUtils.date.parse(parseDate, calendarUtils.date.formats.wireDate)
    assert(calendarUtils.date.get(parsed, "day") === 19, "Should get back 19")
    assert(calendarUtils.date.get(parsed, "month") === 2, "Should get back 2")
    assert(calendarUtils.date.get(parsed, "year") === 2020, "Should get back 2020")
  })

  it("get - invalid", () => {
    const parseDate = "202x-03-19"
    const parsed = calendarUtils.date.parse(parseDate, calendarUtils.date.formats.wireDate)
    assert(calendarUtils.date.get(parsed, "day") === undefined, "Should get back undefined")
    assert(calendarUtils.date.get(parsed, "month") === undefined, "Should get back undefined")
    assert(calendarUtils.date.get(parsed, "year") === undefined, "Should get back undefined")
  })

  it("day of week", () => {
    const parseDate = "2019-05-27"
    const parsed = calendarUtils.date.parse(parseDate, calendarUtils.date.formats.wireDate)
    assert(calendarUtils.date.getDayOfWeek(parsed) === "Mon", "Should get back Mon")
    assert(calendarUtils.date.isDayOfWeek(parsed, "Mon"), "Should get back true")
  })

  it("day of week - invalid", () => {
    const parseDate = "201x-05-27"
    const parsed = calendarUtils.date.parse(parseDate, calendarUtils.date.formats.wireDate)
    assert(calendarUtils.date.getDayOfWeek(parsed) === undefined, "Should get back undefined")
  })

  function assertIsAfter(testDate: string, maxDate: string, expectedResult: boolean) {
    const test = calendarUtils.date.parse(testDate, calendarUtils.date.formats.wireDate)
    const max = calendarUtils.date.parse(maxDate, calendarUtils.date.formats.wireDate)
    assert(calendarUtils.date.isAfter(test, max) === expectedResult, "Should get back " + expectedResult)
  }

  function assertIsBefore(testDate: string, minDate: string, expectedResult: boolean) {
    const test = calendarUtils.date.parse(testDate, calendarUtils.date.formats.wireDate)
    const min = calendarUtils.date.parse(minDate, calendarUtils.date.formats.wireDate)
    assert(calendarUtils.date.isBefore(test, min) === expectedResult, "Should get back " + expectedResult)
  }

  function assertFallsWithinRange(testDate: string, minDate: string, maxDate: string, expectedResult: boolean) {
    const test = calendarUtils.date.parse(testDate, calendarUtils.date.formats.wireDate)
    const min = calendarUtils.date.parse(minDate, calendarUtils.date.formats.wireDate)
    const max = calendarUtils.date.parse(maxDate, calendarUtils.date.formats.wireDate)
    assert(calendarUtils.date.fallsWithinRange(test, min, max) === expectedResult, "Should get back " + expectedResult)
  }

  it("isAfter - after", () => {
    assertIsAfter("2019-05-27", "2019-04-27", true)
  })

  it("isAfter - same day", () => {
    assertIsAfter("2019-05-27", "2019-05-27", false)
  })

  it("isAfter - before", () => {
    assertIsAfter("2019-04-27", "2019-05-27", false)
  })

  it("isBefore - after", () => {
    assertIsBefore("2019-05-27", "2019-04-27", false)
  })

  it("isBefore - same day", () => {
    assertIsBefore("2019-05-27", "2019-05-27", false)
  })

  it("isBefore - before", () => {
    assertIsBefore("2019-04-27", "2019-05-27", true)
  })

  it("fallsWithinRange - after", () => {
    assertFallsWithinRange("2019-06-27", "2019-04-27", "2019-05-27", false)
  })

  it("fallsWithinRange - inside", () => {
    assertFallsWithinRange("2019-04-28", "2019-04-27", "2019-05-27", true)
  })
  it("fallsWithinRange - on max", () => {
    assertFallsWithinRange("2019-05-27", "2019-04-27", "2019-05-27", true)
  })
  it("fallsWithinRange - on min", () => {
    assertFallsWithinRange("2019-04-27", "2019-04-27", "2019-05-27", true)
  })

  it("fallsWithinRange - before", () => {
    assertFallsWithinRange("2019-03-27", "2019-04-27", "2019-05-27", false)
  })
})

describe("calendarUtils.datePart", () => {
  it("parse", () => {
    const parts = calendarUtils.datePart.parse("2019-11-19")
    assert(parts.year === 2019, "Should have year of 2019")
    assert(parts.month === 10, "Should have month of 10")
    assert(parts.day === 19, "Should have month of 19")
  })

  it("parse - invalid", () => {
    const parts = calendarUtils.datePart.parse("xxx")
    assert(parts === undefined, "Should have undefined value")
  })

  it("equals", () => {
    const part = { year: 2019, month: 10, day: 19 }
    const part2 = { year: 2019, month: 10, day: 19 }
    const equals = calendarUtils.datePart.equals(part, part2)
    assert(equals, "Should equals")
  })

  it("equals - year different", () => {
    const part = { year: 2019, month: 10, day: 19 }
    const part2 = { year: 2020, month: 10, day: 19 }
    const equals = calendarUtils.datePart.equals(part, part2)
    assert(!equals, "Should not equals")
  })
  it("equals - month different", () => {
    const part = { year: 2019, month: 10, day: 19 }
    const part2 = { year: 2019, month: 9, day: 19 }
    const equals = calendarUtils.datePart.equals(part, part2)
    assert(!equals, "Should not equals")
  })
  it("equals - day different", () => {
    const part = { year: 2019, month: 10, day: 19 }
    const part2 = { year: 2019, month: 10, day: 18 }
    const equals = calendarUtils.datePart.equals(part, part2)
    assert(!equals, "Should not equals")
  })

  it("format", () => {
    const part = { year: 2019, month: 10, day: 19 }
    const parts = calendarUtils.datePart.format(part)
    assert(parts === "2019-11-19", "Should have format value")
  })
  it("format - no year", () => {
    const part = { month: 10, day: 19 }
    const parts = calendarUtils.datePart.format(part)
    assert(parts === undefined, "Should have undefined value")
  })
  it("format - no month", () => {
    const part = { year: 2019, day: 19 }
    const parts = calendarUtils.datePart.format(part)
    assert(parts === undefined, "Should have undefined value")
  })
  it("format - no day", () => {
    const part = { year: 2019, month: 10 }
    const parts = calendarUtils.datePart.format(part)
    assert(parts === undefined, "Should have undefined value")
  })
})

describe("calendarUtils.time", () => {
  it("getParts", () => {
    const parts = calendarUtils.time.getParts("11:23")
    assert(parts.hours === 11, "Should have hour of 11")
    assert(parts.minutes === 23, "Should have minutes of 23")
  })

  it("getParts - invalid time", () => {
    const parts = calendarUtils.time.getParts("xx")
    assert(parts === undefined, "Should have undefined value")
  })

  it("getHours", () => {
    const parts = calendarUtils.time.getHours()
    assert(parts.length === 24, "Should have 24 hours")
    utils.array.range(0, 24).map((hour, i) => assert(parts[i] === hour, "Should have hour of " + hour))
  })

  it("getMinutes - step 1", () => {
    const parts = calendarUtils.time.getMinutes()
    assert(parts.length === 60, "Should have 60 minutes")
    utils.array.range(0, 60).map((minute, i) => assert(parts[i] === minute, "Should have minute of " + minute))
  })

  it("getMinutes - step 5", () => {
    const parts = calendarUtils.time.getMinutes(5)
    assert(parts.length === 12, "Should have 12 minutes")
    utils.array.range(0, 60, 5).map((minute, i) => assert(parts[i] === minute, "Should have minute of " + minute))
  })

  it("getMinutes - step 15", () => {
    const parts = calendarUtils.time.getMinutes(15)
    assert(parts.length === 4, "Should have 4 minutes")
    utils.array.range(0, 60, 15).map((minute, i) => assert(parts[i] === minute, "Should have minute of " + minute))
  })

  it("getMinutes - step 30", () => {
    const parts = calendarUtils.time.getMinutes(30)
    assert(parts.length === 2, "Should have 2 minutes")
    utils.array.range(0, 60, 30).map((minute, i) => assert(parts[i] === minute, "Should have minute of " + minute))
  })
})
