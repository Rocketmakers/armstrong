import * as React from "react";
import { calendarUtils } from "../utilities/calendarUtils";
import { DayOfWeek, IMonthValue } from "../utilities/definitions";

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

  /** Callback when date changes */
  onDateChanged?: (date: string) => void

  /** Sets the locale */
  locale?: Locale;
}

export interface IDay {
  /** The Day Of Week */
  dayOfWeek: DayOfWeek,
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

export interface IMonth extends IMonthValue {
  daysOfWeek: DayOfWeek[]
  /** The year number */
  year: number
  /** The weeks of the month */
  weeks: IWeek[]
}

export interface IUseCalendar {
  /** The displaying month */
  month: IMonth
  /** The selected date */
  selectedDate: string
  /** The selected date in display format */
  selectedDateDisplay: string
  /** Is the selected date valid (not empty and within 'min' and 'max' range from settings) */
  isSelectedDateValid: boolean
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
  selectDate: (newDate: string) => void
  /** Clears the selected date  */
  clearSelectedDate: () => void
}

interface ICalendarState {
  month: IMonth
  seed: Date
  previousSeed: Date
  nextSeed: Date
}

export function useCalendar(settings: IUseCalendarSettings): IUseCalendar {
  const stringFormat = React.useMemo(() => settings.format || calendarUtils.date.formats.wireDate, [settings.format])
  const startDay = React.useMemo(() => settings.beginOnDay || "Sun", [settings.beginOnDay])
  const displayFormat = React.useMemo(() => settings.displayFormat || calendarUtils.date.formats.wireDate, [settings.displayFormat])
  const seedDate = React.useMemo(() => calendarUtils.date.parseOrToday(settings.selectedDate || settings.seedDate, stringFormat), []);
  const minDate = React.useMemo(() => calendarUtils.date.parseOrUndefined(settings.minDate, stringFormat), [settings.minDate]);
  const maxDate = React.useMemo(() => calendarUtils.date.parseOrUndefined(settings.maxDate, stringFormat), [settings.maxDate]);
  const [date, setCurrentDate] = React.useState(settings.selectedDate ? calendarUtils.date.formatOrEmpty(settings.selectedDate, stringFormat, settings.locale) : "")

  const isSelectedDateValid = React.useMemo(() => {
    const dateType = calendarUtils.date.parseOrUndefined(date, stringFormat)
    if (!dateType) {
      return false
    }

    return calendarUtils.date.fallsWithinRange(dateType, minDate, maxDate)
  }, [date, minDate, maxDate, stringFormat]);

  const selectedDateDisplay = React.useMemo(() => {
    const dt = calendarUtils.date.parseOrUndefined(date, stringFormat)
    if (!dt) {
      return ""
    }
    return calendarUtils.date.format(dt, displayFormat, settings.locale)
  }, [date, isSelectedDateValid]);

  const today = calendarUtils.date.format(calendarUtils.date.today(), stringFormat, settings.locale)

  const [state, setState] = React.useState<ICalendarState>(buildWeeks(seedDate, stringFormat, startDay, displayFormat, today, date, minDate, maxDate, settings.locale))

  const nextMonth = React.useCallback(() => {
    if (!calendarUtils.date.fallsWithinRange(state.nextSeed, undefined, maxDate)) {
      return
    }
    setState(buildWeeks(state.nextSeed, stringFormat, startDay, displayFormat, today, date, minDate, maxDate, settings.locale))
  }, [state.nextSeed, stringFormat, startDay, displayFormat, today, date, maxDate])

  const previousMonth = React.useCallback(() => {
    if (minDate && !calendarUtils.date.fallsWithinRange(state.previousSeed, calendarUtils.date.startOf(minDate, "month"), undefined)) {
      return
    }
    setState(buildWeeks(state.previousSeed, stringFormat, startDay, displayFormat, today, date, minDate, maxDate, settings.locale))
  }, [state.previousSeed, stringFormat, startDay, displayFormat, today, date, minDate])

  const nextYear = React.useCallback(() => {
    const nextSeed = calendarUtils.date.add(state.seed, 1, "year")
    if (!calendarUtils.date.fallsWithinRange(nextSeed, undefined, maxDate)) {
      return
    }
    setState(buildWeeks(nextSeed, stringFormat, startDay, displayFormat, today, date, minDate, maxDate, settings.locale))
  }, [state.seed, stringFormat, startDay, displayFormat, today, date, maxDate])

  const previousYear = React.useCallback(() => {
    const previousSeed = calendarUtils.date.subtract(state.seed, 1, "year")
    if (!calendarUtils.date.fallsWithinRange(previousSeed, minDate, undefined)) {
      return
    }
    setState(buildWeeks(previousSeed, stringFormat, startDay, displayFormat, today, date, minDate, maxDate, settings.locale))
  }, [state.seed, stringFormat, startDay, displayFormat, today, date, minDate])

  const gotoDate = React.useCallback((newDate: string) => {
    const dateType = calendarUtils.date.parseOrToday(newDate, stringFormat)
    if (!calendarUtils.date.fallsWithinRange(dateType, minDate, maxDate)) {
      return
    }

    setState(buildWeeks(dateType, stringFormat, startDay, displayFormat, today, date, minDate, maxDate, settings.locale))
  }, [stringFormat, startDay, displayFormat, today, date, minDate, maxDate])

  const setDate = React.useCallback((newDate: string) => {
    newDate = calendarUtils.date.formatOrEmpty(newDate, stringFormat)
    if (!newDate) {
      return
    }
    const dateType = calendarUtils.date.parseOrToday(newDate, stringFormat)
    if (!calendarUtils.date.fallsWithinRange(dateType, minDate, maxDate)) {
      return
    }

    setCurrentDate(newDate)
    setState(buildWeeks(dateType, stringFormat, startDay, displayFormat, today, newDate, minDate, maxDate, settings.locale))
    if (settings.onDateChanged) {
      settings.onDateChanged(newDate)
    }
  }, [stringFormat, startDay, displayFormat, today, minDate, maxDate, settings.onDateChanged, setCurrentDate])

  const clearSelectedDate = React.useCallback(() => {
    const newDate = ""
    setCurrentDate(newDate)
    setState(buildWeeks(state.seed, stringFormat, startDay, displayFormat, today, newDate, minDate, maxDate, settings.locale))
    if (settings.onDateChanged) {
      settings.onDateChanged(newDate)
    }
  }, [settings.onDateChanged, setCurrentDate, state.seed, stringFormat, startDay, displayFormat, today, minDate, maxDate])

  return { month: state.month, nextMonth, nextYear, previousMonth, previousYear, selectedDateDisplay, selectedDate: date, selectDate: setDate, gotoDate, isSelectedDateValid, clearSelectedDate }
}

function buildWeeks(seed: Date, stringFormat: string, startDay: DayOfWeek, displayFormat: string, today: string, selectedDate: string, minDate: Date, maxDate: Date, locale?: Locale): ICalendarState {
  let start = calendarUtils.date.startOf(seed, "month");
  const monthValue = calendarUtils.month.getMonthValue(start)
  const year = calendarUtils.date.get(start, "year")
  const previousSeed = calendarUtils.date.add(start, -1, "month")
  const nextSeed = calendarUtils.date.add(start, 1, "month")
  while (!calendarUtils.date.isDayOfWeek(start, startDay)) {
    start = calendarUtils.date.subtract(start, 1, "day");
  }
  const weeks: IWeek[] = [];
  for (let weekNo = 0; weekNo < 6; weekNo++) {
    const week: IWeek = { days: [] };
    weeks.push(week);
    for (let dayNo = 0; dayNo < 7; dayNo++) {
      const day: IDay = { 
        date: calendarUtils.date.format(start, stringFormat, locale), 
        dayOfWeek: calendarUtils.date.getDayOfWeek(start), 
        display: calendarUtils.date.format(start, displayFormat, locale), 
        dayNumber: calendarUtils.date.get(start, "day") 
      }
      if (day.date === today) {
        day.isToday = true
      }

      if (!calendarUtils.date.fallsWithinRange(start, minDate, maxDate)) {
        day.outOfRange = true
      }

      if (day.date === selectedDate) {
        day.isCurrentDate = true
      }

      if (calendarUtils.date.get(start, "month") === monthValue.number) {
        day.isCurrentMonth = true
      }

      week.days.push(day);
      start = calendarUtils.date.add(start, 1, "day");
    }
  }
  const month: IMonth = { daysOfWeek: weeks[0].days.map(d => d.dayOfWeek), weeks, ...monthValue, year }
  return { month, seed, previousSeed, nextSeed };
}
