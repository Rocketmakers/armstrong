import * as moment from "moment";
import { ITimeParts, ITimeUtils } from "./definitions";

export class TimeUtils implements ITimeUtils {
  getTimeParts(time: string): ITimeParts {
    const d = moment(time, "HH:mm", false);
    return { hours: d.hour(), minutes: d.minute() };
  }
}

export const timeUtils: ITimeUtils = new TimeUtils()
