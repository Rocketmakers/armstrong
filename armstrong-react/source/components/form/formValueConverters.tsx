import * as React from "react";
import * as _ from "underscore";
import {Formatting} from "../../utilities/formatting";

/** The core value converter */
export interface IValueConverter<TFrom, TTo>{
  /** convert TFrom to TTo */
  convert?: IOneWayValueConverter<TFrom, TTo>;
  /** convert TTo to TFrom */
  convertBack?: IOneWayValueConverter<TTo, TFrom>;
}

/** The core one way value converter */
export interface IOneWayValueConverter<TFrom, TTo>{
  /** convert TFrom to TTo */
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

/** A Numeric Value converter to handle converting typed text to a number */
export class NumericValueConverter implements IInputValueConverter<number> {
  constructor(private options?: INumericOptions){
  }

  convert(data: number){
    let v = (Formatting.isNullOrUndefined(data) || data === "" as any) ? null : data.toFixed(this.options && this.options.decimals);
    return v;
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

      let v = parseFloat(value);
      if (isNaN(v)) {
        return null;
      }

      if (this.options){
        if (!Formatting.isNullOrUndefined(this.options.max)){
          v = Math.min(v, this.options.max)
        }
        if (!Formatting.isNullOrUndefined(this.options.min)){
          v = Math.max(v, this.options.min)
        }
      }
      return v;
    }catch(e){
      return null;
    }
  }

  static instance = new NumericValueConverter();
}

export class MultipleNumericValueConverter implements IValueConverter<number[], string[]> {
  private static converter = NumericValueConverter.instance
  convert(data: number[]){
    return data.map(d => MultipleNumericValueConverter.converter.convert(d));
  }
  convertBack(value: string[]){
    return value.map(d => MultipleNumericValueConverter.converter.convertBack(d));
  }

  static instance = new MultipleNumericValueConverter();
}
