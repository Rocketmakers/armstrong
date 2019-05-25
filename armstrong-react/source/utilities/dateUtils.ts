import * as _ from "underscore";
import { IDateHelperUtils, IDatePartUtils, IDateUtils, IDayUtils, IMonthUtils, IYearUtils } from "./definitions";
import { MomentDatePartUtils, MomentDateUtils, MomentDayUtils, MomentMonthUtils, MomentYearUtils } from "./moment/dates";

class DateHelperUtils implements IDateHelperUtils {
  constructor(
    public year: IYearUtils,
    public month: IMonthUtils,
    public day: IDayUtils,
    public datePart: IDatePartUtils,
    public date: IDateUtils) { }
}

export const dateUtils: IDateHelperUtils = new DateHelperUtils(
  new MomentYearUtils(),
  new MomentMonthUtils(),
  new MomentDayUtils(),
  new MomentDatePartUtils(),
  new MomentDateUtils())
