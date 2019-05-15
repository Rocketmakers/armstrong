import * as moment from "moment";
import * as React from "react";

const isoFormat = "YYYY-MM-DD";

export type DayOfWeek = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat"
export interface IUseCalendarSettings {
  /**
   * The initial date to display the calendar for.
   * Must be in the 'format' specified
   * Defaults to 'selectedDate' or 'today' if not specified
   */
  seedDate?: string
  /**
   * The initial selected date to display the calendar for.
   * Must be in the 'format' specified
   * Defaults to '' if not specified
   */
  selectedDate?: string
  /**
   * The min date the calendar can select.
   * Must be in the 'format' specified
   */
  minDate?: string
  /**
   * The max date the calendar can select.
   * Must be in the 'format' specified
   */
  maxDate?: string
  /**
   * The format of the date (defaults to "YYYY-MM-DD").
   */
  format?: string
  /**
   * The display format of the day date (defaults to "YYYY-MM-DD").
   */
  displayFormat?: string
  /**
   * The day of week to start the calendar week.
   */
  beginOnDay?: DayOfWeek
}

export interface IDay {
  /** The days date (in 'format' from settings ) */
  date: string
  /** The days number (1...31) */
  dayNumber: number
  /** The days display date (in 'format' from settings ) */
  display: string
  /** Is this day today? */
  isToday?: boolean
  /** Is this day the current selected one? */
  isCurrentDate?: boolean
  /** Is this day within the current month? */
  isCurrentMonth?: boolean
  /** Is this day outwith the 'min' and 'max' settings? */
  outOfRange?: boolean
}

export interface IWeek {
  /** The days of the week */
  days: IDay[]
}

export interface IMonth {
  /** The year number */
  year: number
  /** The month number (0 - 11) */
  number: number
  /** The month short name ("Jan"... "Dec") */
  shortName: string
  /** The month name ("January"... "December") */
  name: string
  /** The weeks of the month */
  weeks: IWeek[]
}

export interface IUseCalendar {
  /** The displaying month */
  month: IMonth
  /** The selected date */
  date: string
  /** Is the selected date valid (not empty and within 'min' and 'max' range from settings) */
  isDateValid: boolean
  /** Move to the next month */
  nextMonth: () => void
  /** Move to the previous month */
  previousMonth: () => void
  /** Move to the next year */
  nextYear: () => void
  /** Move to the previous year */
  previousYear: () => void
  /** Move to the a specified date (using the 'format' specified in settings) */
  gotoDate: (newDate: string) => void
  /** Move to and select the a specified date (using the 'format' specified in settings) */
  setDate: (newDate: string) => void
}

interface ICalendarState {
  month: IMonth
  seed: moment.Moment
  previousSeed: moment.Moment
  nextSeed: moment.Moment
}

namespace Dates {
  export function startOfToday() {
    return moment().startOf("day")
  }

  export function fallsWithinRange(mom: moment.Moment, minDate: moment.Moment, maxDate: moment.Moment) {
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

  export function startOfMonth(mom: moment.Moment) {
    return mom.clone().startOf("month")
  }

  export function getMonth(mom: moment.Moment) {
    return mom.month()
  }

  export function getDayNumber(mom: moment.Moment) {
    return mom.date()
  }

  export function getYear(mom: moment.Moment) {
    return mom.year()
  }

  export function format(mom: moment.Moment, formatString: string) {
    return mom.format(formatString)
  }

  export function addMonth(mom: moment.Moment, increment: number) {
    return mom.clone().add(increment, "month")
  }

  export function addDay(mom: moment.Moment, increment: number) {
    return mom.clone().add(increment, "day")
  }

  export function isDayOfWeek(mom: moment.Moment, dayOfWeek: DayOfWeek) {
    return mom.format("ddd") === dayOfWeek
  }
}

export function useCalendar(settings: IUseCalendarSettings): IUseCalendar {
  const format = React.useMemo(() => settings.format || isoFormat, [settings.format])
  const startDay = React.useMemo(() => settings.beginOnDay || "Sun", [settings.beginOnDay])
  const displayFormat = React.useMemo(() => settings.displayFormat || isoFormat, [settings.displayFormat])
  const seedDate = React.useMemo(() => Dates.dateOrToday(settings.selectedDate || settings.seedDate, format), []);
  const minDate = React.useMemo(() => Dates.dateOrNull(settings.minDate, format), [settings.minDate]);
  const maxDate = React.useMemo(() => Dates.dateOrNull(settings.maxDate, format), [settings.maxDate]);
  const [date, setCurrentDate] = React.useState(settings.selectedDate ? Dates.dateOrEmpty(settings.selectedDate, format) : "")
  const isDateValid = React.useMemo(() => {
    const mom = Dates.dateOrNull(date, format)
    if (!mom) {
      return false
    }

    return Dates.fallsWithinRange(mom, minDate, maxDate)
  }, [date, minDate, maxDate, format]);

  const today = Dates.startOfToday().format(format)

  const [state, setState] = React.useState<ICalendarState>(buildWeeks(seedDate, format, startDay, displayFormat, today, date, minDate, maxDate))

  const nextMonth = React.useCallback(() => {
    if (!Dates.fallsWithinRange(state.nextSeed, undefined, maxDate)) {
      return
    }
    setState(buildWeeks(state.nextSeed, format, startDay, displayFormat, today, date, minDate, maxDate))
  }, [state.nextSeed, format, startDay, displayFormat, today, date, maxDate])

  const previousMonth = React.useCallback(() => {
    if (!Dates.fallsWithinRange(state.previousSeed, minDate, undefined)) {
      return
    }
    setState(buildWeeks(state.previousSeed, format, startDay, displayFormat, today, date, minDate, maxDate))
  }, [state.previousSeed, format, startDay, displayFormat, today, date, minDate])

  const nextYear = React.useCallback(() => {
    const nextSeed = state.seed.clone().add(1, "year")
    if (!Dates.fallsWithinRange(nextSeed, undefined, maxDate)) {
      return
    }
    setState(buildWeeks(nextSeed, format, startDay, displayFormat, today, date, minDate, maxDate))
  }, [state.seed, format, startDay, displayFormat, today, date, maxDate])

  const previousYear = React.useCallback(() => {
    const previousSeed = state.seed.clone().add(-1, "year")
    if (!Dates.fallsWithinRange(previousSeed, minDate, undefined)) {
      return
    }
    setState(buildWeeks(previousSeed, format, startDay, displayFormat, today, date, minDate, maxDate))
  }, [state.seed, format, startDay, displayFormat, today, date, minDate])

  const gotoDate = React.useCallback((newDate: string) => {
    const mom = Dates.dateOrToday(newDate, format)
    if (!Dates.fallsWithinRange(mom, minDate, maxDate)) {
      return
    }

    setState(buildWeeks(mom, format, startDay, displayFormat, today, date, minDate, maxDate))
  }, [format, startDay, displayFormat, today, date, minDate, maxDate])

  const setDate = React.useCallback((newDate: string) => {
    newDate = Dates.dateOrEmpty(newDate, format)
    if (!newDate) {
      return
    }
    const mom = Dates.dateOrToday(newDate, format)
    if (!Dates.fallsWithinRange(mom, minDate, maxDate)) {
      return
    }

    setCurrentDate(newDate)
    setState(buildWeeks(mom, format, startDay, displayFormat, today, newDate, minDate, maxDate))
  }, [format, startDay, displayFormat, today, minDate, maxDate])

  return { month: state.month, nextMonth, nextYear, previousMonth, previousYear, date, setDate, gotoDate, isDateValid }
}

function buildWeeks(seed: moment.Moment, format: string, startDay: DayOfWeek, displayFormat: string, today: string, selectedDate: string, minDate: moment.Moment, maxDate: moment.Moment): ICalendarState {
  const start = Dates.startOfMonth(seed);
  const monthNum = Dates.getMonth(start)
  const monthShortName = Dates.format(start, "MMM")
  const monthName = Dates.format(start, "MMMM")
  const year = Dates.getYear(start)
  const previousSeed = Dates.addMonth(start, -1)
  const nextSeed = Dates.addMonth(start, 1)
  while (!Dates.isDayOfWeek(start, startDay)) {
    Dates.addDay(start, -1);
  }
  const weeks: IWeek[] = [];
  for (let weekNo = 0; weekNo < 6; weekNo++) {
    const week: IWeek = { days: [] };
    weeks.push(week);
    for (let dayNo = 0; dayNo < 7; dayNo++) {
      const day: IDay = { date: Dates.format(start, format), display: Dates.format(start, displayFormat), dayNumber: Dates.getDayNumber(start) }
      if (day.date === today) {
        day.isToday = true
      }

      if (!Dates.fallsWithinRange(start, minDate, maxDate)) {
        day.outOfRange = true
      }

      if (day.date === selectedDate) {
        day.isCurrentDate = true
      }

      if (Dates.getMonth(start) === monthNum) {
        day.isCurrentMonth = true
      }

      week.days.push(day);
      Dates.addDay(start, 1);
    }
  }
  const month: IMonth = { weeks, number: monthNum, shortName: monthShortName, name: monthName, year }
  return { month, seed, previousSeed, nextSeed };
}
