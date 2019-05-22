import * as _ from "underscore";

export namespace Utils {
  export function keys(object: any): string[] {
    return _.keys(object)
  }

  export function first<T>(items: T[], n: number) {
    return _.first(items, n)
  }

  export function find<T>(items: T[], func: (t: T, index: number) => boolean) {
    return _.find(items, func)
  }

  export function each<T>(items: T[], func: (t: T, index: number) => void) {
    _.each(items, func)
  }

  export function every<T>(items: T[], func: (t: T, index: number) => boolean): boolean {
    return _.every(items, func)
  }

  export function some<T>(items: T[], func: (t: T, index: number) => boolean): boolean {
    return _.some(items, func)
  }

  export function reduce<T, M>(items: T[], func: (m: M, t: T, index: number) => M, memo: M): M {
    return _.reduce<T, M>(items, func, memo)
  }

  export function reject<T>(items: T[], func: (t: T) => boolean): T[] {
    return _.reject(items, func)
  }

  export function filter<T>(items: T[], func: (t: T, index: number) => boolean): T[] {
    return _.filter(items, func)
  }

  export function isArray(object: any): object is any[] {
    return _.isArray(object)
  }

  export function isString(object: any): object is string {
    return _.isString(object)
  }

  export function isFunction(object: any): object is Function {
    return _.isFunction(object)
  }

  export function isObject(object: any) {
    return _.isObject(object)
  }

  export function isEqual(object: any, other: any) {
    return _.isEqual(object, other)
  }

  export function clone<T>(object: T) {
    return _.clone(object)
  }

  export function range(start: number, stop: number, step: number = 1) {
    return _.range(start, stop, step)
  }

  export function isNullOrUndefined(value: any): value is (undefined | null) {
    return _.isNull(value) || _.isUndefined(value)
  }
}