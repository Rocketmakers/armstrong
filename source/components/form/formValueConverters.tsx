import * as React from "react";
import * as _ from "underscore";

export type IdEntity = {id: string};
export type NumericIdEntity = {id: number};

export interface IValueConverter<D, V>{
  convert?: IItemValueConverter<D, V>;
  convertBack?: IItemValueConverter<V, D>;
}

export interface IItemValueConverter<D, V>{
  (from: D): V;
}

export interface IInputValueConverter<D> extends IValueConverter<D, string>{
}

export class CheckboxValueConverter<D> implements IValueConverter<D, boolean> {
  constructor(private trueValue: D, private falseValue: D){
  }
  convert(data: D){
    return data === this.trueValue;
  }

  convertBack(value: boolean){
    if (value) {
      return this.trueValue;
    }

    return this.falseValue;
  }
}

export class IdEntityValueConverter implements IInputValueConverter<IdEntity> {
  constructor(public convertBack: IItemValueConverter<string, IdEntity>){
  }
  convert(data: IdEntity){
    return !data ? "0" : data.id;
  }
}

export class IdValueConverter implements IInputValueConverter<string> {
  constructor(public convertBack: IItemValueConverter<string, string>){
  }
  convert(data: string){
    return data;
  }
}

export class NumericIdEntityValueConverter implements IInputValueConverter<NumericIdEntity> {
  constructor(public convertBack: IItemValueConverter<string, NumericIdEntity>){
  }
  convert(data: NumericIdEntity){
    return !data || _.isUndefined(data) || _.isNull(data) ? "0" : data.id.toString();
  }
}

export class NumericIdValueConverter implements IInputValueConverter<number> {
  constructor(public convertBack: IItemValueConverter<string, number>){
  }
  convert(data: number){
    return _.isUndefined(data) || _.isNull(data) ? "0" : data.toString();
  }
}

export class DefaultValueConverter implements IInputValueConverter<string> {
  convert(data: string){
    return data;
  }
  convertBack(value: string){
    return value;
  }
  static instance = new DefaultValueConverter();
}

export interface INumericOptions{
  allowNegative?: boolean;
  decimals?: number;
  min?: number;
  max?: number;
}

export class NumericValueConverter implements IInputValueConverter<number> {
  constructor(private options?: INumericOptions){
  }

  convert(data: number){
    const decimals = this.options && this.options.decimals;
    return _.isUndefined(data) || _.isNull(data) ? null : data.toFixed(decimals);
  }

  convertBack(value: string){
    try{
      if (!value.length) {
        return null;
      }
      if (value.length === 1 && value === "-") {
        return 0;
      }
      if (value.length === 2 && value === "-.") {
        return 0;
      }
      const decimals = this.options && this.options.decimals;
      let v = decimals ? parseFloat(value) : parseInt(value);
      if (isNaN(v)) {
        return;
      }
      if (this.options){
        if (!_.isUndefined(this.options.max)){
          if (v > this.options.max){
            v = this.options.max;
          }
        }
        if (!_.isUndefined(this.options.min)){
          if (v < this.options.min){
            v = this.options.min;
          }
        }
      }

      if (decimals) {
        return parseFloat(v.toFixed(decimals));
      }
      return v;
    }catch(e){
    }
  }
}
