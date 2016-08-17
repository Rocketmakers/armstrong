import * as React from "react";
import * as _ from "underscore";

export type IdEntity = {id: string};
export type NumericIdEntity = {id: number};

/** The core value converter */
export interface IValueConverter<TFrom, TTo>{
  convert?: IOneWayValueConverter<TFrom, TTo>;
  convertBack?: IOneWayValueConverter<TTo, TFrom>;
}

/** The core one way value converter */
export interface IOneWayValueConverter<TFrom, TTo>{
  (from: TFrom): TTo;
}

/** The core 'text' input value converter (always requires a string ) */
export interface IInputValueConverter<TDataPropValue> extends IValueConverter<TDataPropValue, string>{
}

/** The core 'checkbox' input value converter (always requires a boolean) */
export class CheckboxValueConverter<TDataPropValue> implements IValueConverter<TDataPropValue, boolean> {
  constructor(private trueValue: TDataPropValue, private falseValue: TDataPropValue){
  }
  convert(data: TDataPropValue){
    return data === this.trueValue;
  }

  convertBack(value: boolean){
    if (value) {
      return this.trueValue;
    }

    return this.falseValue;
  }
}

/** Converts numeric id of property item to string  */
export class IdEntityValueConverter implements IInputValueConverter<IdEntity> {
  constructor(public convertBack: IOneWayValueConverter<string, IdEntity>){
  }
  convert(data: IdEntity){
    return !data ? "0" : data.id;
  }
}

/** Pass-through converter - used for setting string id value on bound property item */
export class IdValueConverter implements IInputValueConverter<string> {
  constructor(public convertBack: IOneWayValueConverter<string, string>){
  }
  convert(data: string){
    return data;
  }
}

/** Converts numeric id of item to string  */
export class NumericIdEntityValueConverter implements IInputValueConverter<NumericIdEntity> {
  constructor(public convertBack: IOneWayValueConverter<string, NumericIdEntity>){
  }
  convert(data: NumericIdEntity){
    return !data || !_.isNumber(data.id) || isNaN(data.id)  ? "0" : data.id.toString();
  }
}

/** Converts string to number - used for setting numeric id value on bound element */
export class NumericIdValueConverter implements IInputValueConverter<number> {
  constructor(public convertBack: IOneWayValueConverter<string, number>){
  }
  convert(data: number){
    return !_.isNumber(data) || isNaN(data) ? "0" : data.toString();
  }
}

/** The Default pass-through Value converter */
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
  /** allow negative values? */
  allowNegative?: boolean;
  /** number of decimals */
  decimals?: number;
  /** min value */
  min?: number;
  /** max value */
  max?: number;
  /** range step */
  step?: number;
}

/** A Numeric Value converter written to handle Text Input */
export class NumericValueConverter implements IInputValueConverter<number> {
  constructor(private options?: INumericOptions){
  }

  convert(data: number){
    return _.isUndefined(data) || _.isNull(data) ? null : data.toFixed(this.options && this.options.decimals);
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
          v = Math.min(v, this.options.max)
        }
        if (!_.isUndefined(this.options.min)){
          v = Math.max(v, this.options.min)
        }
      }

      if (decimals) {
        return parseFloat(v.toFixed(decimals));
      }
      return v;
    }catch(e){
    }
  }

  static instance = new NumericValueConverter();
}
