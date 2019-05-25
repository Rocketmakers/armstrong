import { IDatePartUtils, IDateTimeUtils, IDateUtils, IDayUtils, ILocaleUtils, IMonthUtils, ITimeUtils, IYearUtils } from "./definitions";
import { MomentDatePartUtils, MomentDateTimeUtils, MomentDayUtils, MomentLocaleUtils, MomentMonthUtils, MomentYearUtils } from "./moment/dates";
import { MomentTimeUtils } from "./moment/times";

class DateUtils implements IDateUtils {
  constructor(
    public year: IYearUtils,
    public month: IMonthUtils,
    public day: IDayUtils,
    public datePart: IDatePartUtils,
    public date: IDateTimeUtils,
    public locale: ILocaleUtils,
    public time: ITimeUtils) { }
}

export const dateUtils: IDateUtils = new DateUtils(
  new MomentYearUtils(),
  new MomentMonthUtils(),
  new MomentDayUtils(),
  new MomentDatePartUtils(),
  new MomentDateTimeUtils(),
  new MomentLocaleUtils(),
  new MomentTimeUtils())
