/** An Opaque Date Time type */
export interface IDateType {
  isValid(): boolean;
}

/** The Day Of Week */
export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

/** Specify a unit of date */
export type UnitOfDate = "day" | "month" | "year";

export interface ILocaleUtils {
  /** Set the locale of the date provider */
  setLocale(locale: string): void;
  /** Has the locale been set on the date provider */
  isLocaleSet(): boolean;
}

/** A date split into day, month and year */
export interface IDateParts {
  /** The day number (0 - 31) */
  day: number;
  /** The month number (0 - 11) */
  month: number;
  /** The year number (2019) */
  year: number;
}

/** A time split into hours and minutes */
export interface ITimeParts {
  /** The hour number (0 - 23) */
  hours: number;
  /** The minute number (0 - 59) */
  minutes: number;
}

export interface ITimeUtils {
  /** parse a time string ("HH:mm") to time parts */
  getParts(time: string): ITimeParts;
  /** Get minute interval values (minuteStep defaults to 1) */
  getMinutes(minuteStep?: number): number[];
  /** Get hour interval values (0 to 23) */
  getHours(): number[];
}

export interface IYearUtils {
  /** Generate years between the min/max dates, or the constant +/- range */
  generate(settings?: {
    minDate?: string;
    maxDate?: string;
    range?: number;
    dateFormat?: string;
  }): number[];
}

export interface IMonthValue {
  /** The month number (0 - 11) */
  number: number;
  /** The month short name ("Jan"... "Dec") */
  shortName: string;
  /** The month name ("January"... "December") */
  name: string;
}

export interface IMonthUtils {
  /** Get months in year, optionally limit the months according to min/max dates */
  getMonthsInYear(
    year: number,
    minDate: string,
    maxDate: string,
    dateFormat?: string,
  ): IMonthValue[];
  /** Get months in year */
  getMonthValues(): IMonthValue[];
  /** Get month value for date type */
  getMonthValue(dateType: IDateType): IMonthValue;
}

export interface IDayUtils {
  /** Get the days within the month and year, optionally limit to min/max date */
  getMonthYear(
    month: number,
    year: number,
    settings?: { minDate?: string; maxDate?: string; dateFormat?: string },
  ): number[];
}

export interface IDateUtils {
  /** Describes the basic formats */
  readonly formats: { readonly wireDate: string };
  /** Date at start of today */
  today(): IDateType;
  /** Date Time at start of unit */
  startOf(dateType: IDateType, unitOfTime: UnitOfDate): IDateType;
  /** Is dateType before minDate (using unit - default day) */
  isBefore(
    dateType: IDateType,
    minDate: IDateType,
    unitOfTime?: UnitOfDate,
  ): boolean;
  /** Is dateType before minDate (using unit - default day) */
  isAfter(
    dateType: IDateType,
    minDate: IDateType,
    unitOfTime?: UnitOfDate,
  ): boolean;
  /** Is dateType within range */
  fallsWithinRange(
    dateType: IDateType,
    minDate: IDateType,
    maxDate: IDateType,
  ): boolean;
  /** Parse the date string into the provided format */
  parse(date: string, dateFormat: string): IDateType;
  /** Parse the date string into the provided format - If invalid return today */
  parseOrToday(date: string, formatString: string): IDateType;
  /** Parse the date string into the provided format - If invalid return undefined */
  parseOrUndefined(date: string, formatString: string): IDateType | undefined;
  /** Get a unit of date */
  get(dateType: IDateType, unitOfTime: UnitOfDate): number;
  /** Format the dateType into a string */
  format(dateType: IDateType, formatString: string): string;
  /** Format the date string into a string, or empty string if date invalid */
  formatOrEmpty(date: string, formatString: string): string;
  /** Add a unit of time to the date */
  add(
    dateType: IDateType,
    increment: number,
    unitOfTime: UnitOfDate,
  ): IDateType;
  /** Subtract a unit of time to the date */
  subtract(
    dateType: IDateType,
    increment: number,
    unitOfTime: UnitOfDate,
  ): IDateType;

  /** Get the day of week of the dateType */
  getDayOfWeek(dateType: IDateType): DayOfWeek;
  /** Is the dateType a dayOfWeek */
  isDayOfWeek(dateType: IDateType, dayOfWeek: DayOfWeek): boolean;
}

export interface IDatePartUtils {
  /** Have the date parts changed */
  equals(original: Partial<IDateParts>, newValue: Partial<IDateParts>): boolean;
  /** Parse the date to date parts */
  parse(
    date: string,
    settings?: { includeDate?: boolean; dateFormat?: string },
  ): IDateParts & { date?: string };
  /** Format the date parts into the specified format */
  format(dateParts: Partial<IDateParts>, dateFormat?: string): string;
}

export interface IObjectUtils {
  /** Get the keys of the object */
  keys(object: any): string[];
  /** Is this object an array */
  isArray(object: any): object is any[];
  /** Is this object a string */
  isString(object: any): object is string;
  /** Is this object a function */
  isFunction(object: any): object is Function;
  /** Is this object a boolean */
  isObject(object: any): boolean;
  /** Is this object equal to the other */
  isEqual(object: any, other: any): boolean;
  /** Clone the object */
  clone<T>(object: T): T;
  /** Is this object null or undefined */
  isNullOrUndefined(value: any): value is undefined | null;
  /** Is this object undefined */
  isUndefined(value: any): value is undefined;
  /** Is this object null */
  isNull(value: any): value is null;
}

export interface IArrayUtils {
  /** Get the first n items */
  first<T>(items: T[], n: number): T[];
  /** Find an item */
  find<T>(items: T[], func: (t: T, index: number) => boolean): T;
  /** ForEach on the items */
  each<T>(items: T[], func: (t: T, index: number) => void): void;
  /** Do *ALL* items pass a test */
  every<T>(items: T[], func: (t: T, index: number) => boolean): boolean;
  /** Do *ANY* items pass a test */
  some<T>(items: T[], func: (t: T, index: number) => boolean): boolean;
  /** Array Reduction */
  reduce<T, M>(items: T[], func: (m: M, t: T, index: number) => M, memo: M): M;
  /** Filter by rejecting items */
  reject<T>(items: T[], func: (t: T) => boolean): T[];
  /** Filter items */
  filter<T>(items: T[], func: (t: T, index: number) => boolean): T[];
  /** Generate a numeric array (start inclusive, stop exclusive) */
  range(start: number, stop: number, step?: number, fill?: boolean): number[];
  /** Get a page of data from the items (pageNumber starts at 1) */
  getPage<T>(items: T[], pageNumber: number, pageSize: number);
}

/** import {utils} from "armstrong-react" */
export interface IUtils {
  /** object utilities */
  object: IObjectUtils;
  /** array utilities */
  array: IArrayUtils;
}

/** import {calendarUtils} from "armstrong-react" */
export interface ICalendarUtils {
  /** time utilities */
  time: ITimeUtils;
  /** year utilities */
  year: IYearUtils;
  /** month utilities */
  month: IMonthUtils;
  /** day utilities */
  day: IDayUtils;
  /** date part utilities */
  datePart: IDatePartUtils;
  /** date utilities */
  date: IDateUtils;
  /** locale utilities */
  locale: ILocaleUtils;
}
