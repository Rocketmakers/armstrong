import { ICalendarUtils, IDatePartUtils, IDateUtils, IDayUtils, ILocaleUtils, IMonthUtils, ITimeUtils, IYearUtils } from "./definitions";
import { MomentDatePartUtils, MomentDateUtils, MomentDayUtils, MomentLocaleUtils, MomentMonthUtils, MomentYearUtils } from "./moment/dates";
import { MomentTimeUtils } from "./moment/times";

class CalendarUtils implements ICalendarUtils {
  constructor(
    public year: IYearUtils,
    public month: IMonthUtils,
    public day: IDayUtils,
    public datePart: IDatePartUtils,
    public date: IDateUtils,
    public locale: ILocaleUtils,
    public time: ITimeUtils) { }
}

export const calendarUtils: ICalendarUtils = new CalendarUtils(
  new MomentYearUtils(),
  new MomentMonthUtils(),
  new MomentDayUtils(),
  new MomentDatePartUtils(),
  new MomentDateUtils(),
  new MomentLocaleUtils(),
  new MomentTimeUtils())
