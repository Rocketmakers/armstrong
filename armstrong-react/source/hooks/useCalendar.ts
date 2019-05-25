import * as React from "react";
import { dateUtils } from "../utilities/dateUtils";
import { DayOfWeek, IDateTimeType, IMonthValue } from "../utilities/definitions";

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
  seed: IDateTimeType
  previousSeed: IDateTimeType
  nextSeed: IDateTimeType
}

export function useCalendar(settings: IUseCalendarSettings): IUseCalendar {
  const format = React.useMemo(() => settings.format || dateUtils.date.formats.wireDate, [settings.format])
  const startDay = React.useMemo(() => settings.beginOnDay || "Sun", [settings.beginOnDay])
  const displayFormat = React.useMemo(() => settings.displayFormat || dateUtils.date.formats.wireDate, [settings.displayFormat])
  const seedDate = React.useMemo(() => dateUtils.date.parseOrToday(settings.selectedDate || settings.seedDate, format), []);
  const minDate = React.useMemo(() => dateUtils.date.parseOrUndefined(settings.minDate, format), [settings.minDate]);
  const maxDate = React.useMemo(() => dateUtils.date.parseOrUndefined(settings.maxDate, format), [settings.maxDate]);
  const [date, setCurrentDate] = React.useState(settings.selectedDate ? dateUtils.date.formatOrEmpty(settings.selectedDate, format) : "")

  const isSelectedDateValid = React.useMemo(() => {
    const dateType = dateUtils.date.parseOrUndefined(date, format)
    if (!dateType) {
      return false
    }

    return dateUtils.date.fallsWithinRange(dateType, minDate, maxDate)
  }, [date, minDate, maxDate, format]);

  const selectedDateDisplay = React.useMemo(() => {
    const dateType = dateUtils.date.parseOrUndefined(date, format)
    if (!dateType) {
      return ""
    }

    return dateUtils.date.format(dateType, displayFormat)
  }, [date, isSelectedDateValid]);

  const today = dateUtils.date.format(dateUtils.date.today(), format)

  const [state, setState] = React.useState<ICalendarState>(buildWeeks(seedDate, format, startDay, displayFormat, today, date, minDate, maxDate))

  const nextMonth = React.useCallback(() => {
    if (!dateUtils.date.fallsWithinRange(state.nextSeed, undefined, maxDate)) {
      return
    }
    setState(buildWeeks(state.nextSeed, format, startDay, displayFormat, today, date, minDate, maxDate))
  }, [state.nextSeed, format, startDay, displayFormat, today, date, maxDate])

  const previousMonth = React.useCallback(() => {
    if (!dateUtils.date.fallsWithinRange(state.previousSeed, minDate, undefined)) {
      return
    }
    setState(buildWeeks(state.previousSeed, format, startDay, displayFormat, today, date, minDate, maxDate))
  }, [state.previousSeed, format, startDay, displayFormat, today, date, minDate])

  const nextYear = React.useCallback(() => {
    const nextSeed = dateUtils.date.add(state.seed, 1, "year")
    if (!dateUtils.date.fallsWithinRange(nextSeed, undefined, maxDate)) {
      return
    }
    setState(buildWeeks(nextSeed, format, startDay, displayFormat, today, date, minDate, maxDate))
  }, [state.seed, format, startDay, displayFormat, today, date, maxDate])

  const previousYear = React.useCallback(() => {
    const previousSeed = dateUtils.date.add(state.seed, -1, "year")
    if (!dateUtils.date.fallsWithinRange(previousSeed, minDate, undefined)) {
      return
    }
    setState(buildWeeks(previousSeed, format, startDay, displayFormat, today, date, minDate, maxDate))
  }, [state.seed, format, startDay, displayFormat, today, date, minDate])

  const gotoDate = React.useCallback((newDate: string) => {
    const dateType = dateUtils.date.parseOrToday(newDate, format)
    if (!dateUtils.date.fallsWithinRange(dateType, minDate, maxDate)) {
      return
    }

    setState(buildWeeks(dateType, format, startDay, displayFormat, today, date, minDate, maxDate))
  }, [format, startDay, displayFormat, today, date, minDate, maxDate])

  const setDate = React.useCallback((newDate: string) => {
    newDate = dateUtils.date.formatOrEmpty(newDate, format)
    if (!newDate) {
      return
    }
    const dateType = dateUtils.date.parseOrToday(newDate, format)
    if (!dateUtils.date.fallsWithinRange(dateType, minDate, maxDate)) {
      return
    }

    setCurrentDate(newDate)
    setState(buildWeeks(dateType, format, startDay, displayFormat, today, newDate, minDate, maxDate))
    if (settings.onDateChanged) {
      settings.onDateChanged(newDate)
    }
  }, [format, startDay, displayFormat, today, minDate, maxDate, settings.onDateChanged, setCurrentDate])

  const clearSelectedDate = React.useCallback(() => {
    const newDate = ""
    setCurrentDate(newDate)
    setState(buildWeeks(state.seed, format, startDay, displayFormat, today, newDate, minDate, maxDate))
    if (settings.onDateChanged) {
      settings.onDateChanged(newDate)
    }
  }, [settings.onDateChanged, setCurrentDate, state.seed, format, startDay, displayFormat, today, minDate, maxDate])

  return { month: state.month, nextMonth, nextYear, previousMonth, previousYear, selectedDateDisplay, selectedDate: date, selectDate: setDate, gotoDate, isSelectedDateValid, clearSelectedDate }
}

function buildWeeks(seed: IDateTimeType, format: string, startDay: DayOfWeek, displayFormat: string, today: string, selectedDate: string, minDate: IDateTimeType, maxDate: IDateTimeType): ICalendarState {
  let start = dateUtils.date.startOf(seed, "month");
  const monthValue = dateUtils.month.getMonthValue(start)
  const year = dateUtils.date.get(start, "year")
  const previousSeed = dateUtils.date.add(start, -1, "month")
  const nextSeed = dateUtils.date.add(start, 1, "month")
  while (!dateUtils.date.isDayOfWeek(start, startDay)) {
    start = dateUtils.date.add(start, -1, "day");
  }
  const weeks: IWeek[] = [];
  for (let weekNo = 0; weekNo < 6; weekNo++) {
    const week: IWeek = { days: [] };
    weeks.push(week);
    for (let dayNo = 0; dayNo < 7; dayNo++) {
      const day: IDay = { date: dateUtils.date.format(start, format), dayOfWeek: dateUtils.date.getDayOfWeek(start), display: dateUtils.date.format(start, displayFormat), dayNumber: dateUtils.date.get(start, "year") }
      if (day.date === today) {
        day.isToday = true
      }

      if (!dateUtils.date.fallsWithinRange(start, minDate, maxDate)) {
        day.outOfRange = true
      }

      if (day.date === selectedDate) {
        day.isCurrentDate = true
      }

      if (dateUtils.date.get(start, "month") === monthValue.number) {
        day.isCurrentMonth = true
      }

      week.days.push(day);
      start = dateUtils.date.add(start, 1, "day");
    }
  }
  const month: IMonth = { daysOfWeek: weeks[0].days.map(d => d.dayOfWeek), weeks, ...monthValue, year }
  return { month, seed, previousSeed, nextSeed };
}
