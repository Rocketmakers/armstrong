export class Formatting {
  static twoDigitNumber(value: number) {
    return value > 9 ? value.toString() : `0${value}`
  }
}
