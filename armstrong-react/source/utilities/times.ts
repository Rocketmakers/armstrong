import * as moment from "moment";

export namespace Times {
  export function getTimeParts(time: string) {
    const d = moment(time, "HH:mm", false);
    return { hours: d.hour(), minutes: d.minute() };
  }
}
