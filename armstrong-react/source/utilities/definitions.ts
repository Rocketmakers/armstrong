/** An Opaque Date Time type */
export interface IDateTimeType { isValid(): boolean, toISOString(): string }

/** The Day Of Week */
export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"

/** Specify a unit of time */
export type UnitOfTime = "day" | "month" | "year" | "hour" | "minute" | "second"

export interface IDateParts {
  /** The day number (0 - 31) */
  day: number
  /** The month number (0 - 11) */
  month: number
  /** The year number (2019) */
  year: number
}

export interface ITimeParts {
  /** The hour number (0 - 23) */
  hours: number
  /** The minute number (0 - 59) */
  minutes: number
}

export interface ITimeUtils {
  /** parse a time string ("HH:mm") to time parts */
  getTimeParts(time: string): ITimeParts
}

export interface IYearUtils {
  /** Generate years between the min/max dates, or the constant +/- range */
  generate(settings?: { minDate?: string, maxDate?: string, range?: number, dateFormat?: string }): number[]
}

export interface IMonthValue {
  /** The month number (0 - 11) */
  number: number
  /** The month short name ("Jan"... "Dec") */
  shortName: string
  /** The month name ("January"... "December") */
  name: string
}

export interface IMonthUtils {
  /** Get months in year, optionally limit the months according to min/max dates */
  getMonthsInYear(year: number, settings?: { minDate?: string, maxDate?: string, dateFormat?: string }): IMonthValue[]
  /** Get months in year */
  getMonthValues(): IMonthValue[]
  /** Get month value for date type */
  getMonthValue(dateType: IDateTimeType): IMonthValue
}

export interface IDayUtils {
  /** Get the days within the month and year, optionally limit to min/max date */
  inMonthYear(month: number, year: number, settings?: { minDate?: string, maxDate?: string, dateFormat?: string }): number[]
}

export interface IDateUtils {
  /** Describes the basic formats */
  formats: { wireDate: string }

  /** Date Time as of Now */
  now(): IDateTimeType
  /** Date Time at start of today */
  today(): IDateTimeType
  /** Date Time at start of unit */
  startOf(dateType: IDateTimeType, unitOfTime: UnitOfTime): IDateTimeType
  /** Is dateType before minDate (using unit - default day) */
  isBefore(dateType: IDateTimeType, minDate: IDateTimeType, unitOfTime?: UnitOfTime): boolean
  /** Is dateType before minDate (using unit - default day) */
  isAfter(dateType: IDateTimeType, minDate: IDateTimeType, unitOfTime?: UnitOfTime): boolean
  /** Is dateType within range */
  fallsWithinRange(dateType: IDateTimeType, minDate: IDateTimeType, maxDate: IDateTimeType): boolean
  /** Parse the date string into the provided format */
  parse(date: string, dateFormat: string): IDateTimeType
  /** Parse the date string into the provided format - If invalid return today */
  parseOrToday(date: string, formatString: string): IDateTimeType
  /** Parse the date string into the provided format - If invalid return undefined */
  parseOrUndefined(date: string, formatString: string): IDateTimeType | undefined
  /** Get a unit of date/time */
  get(dateType: IDateTimeType, unitOfTime: UnitOfTime): number
  /** Format the dateType into a string */
  format(dateType: IDateTimeType, formatString: string): string
  /** Format the date string into a string, or empty string if date invalid */
  formatOrEmpty(date: string, formatString: string): string
  /** Add a unit of time to the date */
  add(dateType: IDateTimeType, increment: number, unitOfTime: UnitOfTime): IDateTimeType
  /** Subtract a unit of time to the date */
  subtract(dateType: IDateTimeType, increment: number, unitOfTime: UnitOfTime): IDateTimeType

  /** Get the day of week of the dateType */
  getDayOfWeek(dateType: IDateTimeType): DayOfWeek
  /** Is the dateType a dayOfWeek */
  isDayOfWeek(dateType: IDateTimeType, dayOfWeek: DayOfWeek): boolean
}

export interface IDatePartUtils {
  /** Have the date parts changed */
  haveChanged(newState: Partial<IDateParts>, dateState: Partial<IDateParts>): boolean
  /** Parse the date to date parts */
  parse(date: string, settings?: { includeDate?: boolean, dateFormat?: string }): IDateParts & { date?: string }
  /** Format the date parts into the specified format */
  format(dateParts: Partial<IDateParts>, dateFormat?: string): string
}

export interface IObjectUtils {
  keys(object: any): string[]
  isArray(object: any): object is any[]
  isString(object: any): object is string
  isFunction(object: any): object is Function
  isObject(object: any): boolean
  isEqual(object: any, other: any)
  clone<T>(object: T): T
  isNullOrUndefined(value: any): value is undefined | null
  isUndefined(value: any): value is undefined
}

export interface IArrayUtils {
  first<T>(items: T[], n: number): T[]
  find<T>(items: T[], func: (t: T, index: number) => boolean): T
  each<T>(items: T[], func: (t: T, index: number) => void): void
  every<T>(items: T[], func: (t: T, index: number) => boolean): boolean
  some<T>(items: T[], func: (t: T, index: number) => boolean): boolean
  reduce<T, M>(items: T[], func: (m: M, t: T, index: number) => M, memo: M): M
  reject<T>(items: T[], func: (t: T) => boolean): T[]
  filter<T>(items: T[], func: (t: T, index: number) => boolean): T[]
  range(start: number, stop: number, step?: number): number[]
}

export interface IUtils {
  object: IObjectUtils
  array: IArrayUtils
}

export interface IDateHelperUtils {
  year: IYearUtils
  month: IMonthUtils
  day: IDayUtils
  datePart: IDatePartUtils
  date: IDateUtils
}
