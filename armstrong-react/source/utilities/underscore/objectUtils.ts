import * as _ from "underscore";
import { IObjectUtils } from "../definitions";

export class UnderscoreObjectUtils implements IObjectUtils {
  keys(object: any): string[] {
    return _.keys(object)
  }

  isArray(object: any): object is any[] {
    return _.isArray(object)
  }

  isString(object: any): object is string {
    return _.isString(object)
  }

  isFunction(object: any): object is Function {
    return _.isFunction(object)
  }

  isObject(object: any): boolean {
    return _.isObject(object)
  }

  isEqual(object: any, other: any) {
    return _.isEqual(object, other)
  }

  clone<T>(object: T): T {
    return _.clone(object)
  }

  isNullOrUndefined(value: any): value is undefined | null {
    return _.isNull(value) || _.isUndefined(value)
  }

  isUndefined(value: any): value is undefined {
    return _.isUndefined(value)
  }

  isNull(value: any): value is null {
    return _.isNull(value)
  }
}
