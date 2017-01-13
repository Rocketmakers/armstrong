import * as _ from "underscore";

export class Formatting{
  static twoDigitNumber(value: number){
    return value > 9 ? value.toString() : `0${value}`
  }

  static isNullOrUndefined(value) {
    return _.isNull(value) || _.isUndefined(value)
  }
}
