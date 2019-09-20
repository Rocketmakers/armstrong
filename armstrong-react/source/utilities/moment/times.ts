import * as moment from "moment";
import { ITimeParts, ITimeUtils } from "../definitions";
import { utils } from "../utils";

export class MomentTimeUtils implements ITimeUtils {
  getParts(time: string): ITimeParts {
    const d = moment(time, "HH:mm", false);
    if (!d.isValid()) {
      return
    }
    return { hours: d.hour(), minutes: d.minute() };
  }

  getMinutes(minuteStep = 1) {
    return utils.array.range(0, 60, minuteStep);
  }

  getHours() {
    return utils.array.range(0, 24);
  }
}
