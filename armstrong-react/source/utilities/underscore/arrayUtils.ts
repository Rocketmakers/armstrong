import * as _ from "underscore";
import { IArrayUtils } from "../definitions";

export class UnderscoreArrayUtils implements IArrayUtils {
  first<T>(items: T[], n: number) {
    return _.first(items, n);
  }

  find<T>(items: T[], func: (t: T, index: number) => boolean) {
    return _.find(items, func);
  }

  each<T>(items: T[], func: (t: T, index: number) => void) {
    _.each(items, func);
  }

  every<T>(items: T[], func: (t: T, index: number) => boolean): boolean {
    return _.every(items, func);
  }

  some<T>(items: T[], func: (t: T, index: number) => boolean): boolean {
    return _.some(items, func);
  }

  filterByArray<T, K>(items: T[], filterItems: any[], filterKey: keyof T): T[] {
    return _.filter(items, (item: T, index: number) => {
      return filterItems.indexOf(item[filterKey]) !== -1;
    });
  }

  reduce<T, M>(
    items: T[],
    func: (memo: M, item: T, index: number) => M,
    memo: M,
  ): M {
    return _.reduce<T, M>(items, func, memo);
  }

  reject<T>(items: T[], func: (t: T, index: number) => boolean): T[] {
    return _.reject(items, func);
  }

  filter<T>(items: T[], func: (t: T, index: number) => boolean): T[] {
    return _.filter(items, func);
  }

  range(start: number, stop: number, step: number = 1, fill?: boolean) {
    return _.range(start, fill ? stop + 1 : stop, step);
  }

  getPage<T>(items: T[], pageNumber: number, pageSize: number) {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return this.filter(items, (__, i) => i >= startIndex && i < endIndex);
  }
}
