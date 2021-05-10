import { ITimeParts, ITimeUtils } from "../definitions";
import { utils } from "../utils";
import { parse, isValid, getHours, getMinutes } from 'date-fns';

export class MomentTimeUtils implements ITimeUtils {
  getParts(time: string): ITimeParts {
    const d = parse(time, "HH:mm", new Date());
    if (!isValid(d)) {
      return
    }
    return { hours: getHours(d), minutes: getMinutes(d) };
  }

  getMinutes(minuteStep = 1) {
    return utils.array.range(0, 60, minuteStep);
  }

  getHours() {
    return utils.array.range(0, 24);
  }
}
