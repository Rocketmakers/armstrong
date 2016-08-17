import * as React from "react";
import * as _ from "underscore";
import {IFormBinder,IDataBinder,IFormBinderInjector,dataBinderAttribute} from "./formCore";
import {
  IdEntity,
  NumericIdEntity,
  IOneWayValueConverter,
  IValueConverter,
  IInputValueConverter,
  CheckboxValueConverter,
  NumericValueConverter,
  INumericOptions,
  NumericIdEntityValueConverter,
  NumericIdValueConverter,
  DefaultValueConverter,
  IdEntityValueConverter,
  IdValueConverter} from "./formValueConverters";

class EntityItems{
  static itemsId(items: IdEntity[]): IOneWayValueConverter<string, IdEntity>{
    return value => _.find(items, i => i.id.toString() === value)
  }
  static itemsNumericId(items: NumericIdEntity[]): IOneWayValueConverter<string, NumericIdEntity>{
    return value => _.find(items, i => i.id.toString() === value);
  }
}

/**
The (abstract) FormBinder, derive from this calss to create your own custom FormBinder
TComponentProps: The type of the props required on the component being placed inside the form
TDataPropValue: The type of the data property being bound
TComponentPropValue: The type of the target property being bound on the component
*/
export abstract class FormBinderBase<TComponentProps,TDataPropValue,TComponentPropValue> implements IFormBinder<TComponentProps, any> {
  constructor(
    /** The name of the data property being bound  */
    protected dataName: string,
    /** The name of the component property being bound  */
    protected propertySet: string,
    /** The converter required to convert 'dataName' to 'propertySet' (TDataPropValue to TComponentPropValue) */
    private valueConverter?: IValueConverter<TDataPropValue, TComponentPropValue>,
    /** The name of the property being read from the change event currentTarget */
    protected propertyGet = propertySet){
  }

  /** Sets the React elements properties required in binding */
  setElementProperty(props: TComponentProps, dataBinder:IDataBinder<any>) {
    props["name"] = this.dataName;
    props[this.propertySet] = this.convert(dataBinder.getValue(this.dataName));
  }

  /** handle the change event, to modify the dataBinder (safely via this.onChanged(...)), then notifyChanged */
  abstract handleValueChanged(props: TComponentProps, dataBinder:IDataBinder<any>, notifyChanged: () => void): void;

  /** convert the value from element to data, set the dataBinder, and notify if changed */
  protected onChanged(dataBinder:IDataBinder<any>, newValue: TComponentPropValue, notifyChanged: () => void) {
    const value = this.convertBack(newValue);
    if (_.isUndefined(value)) {
      return;
    }

    dataBinder.setValue(this.dataName, value);
    notifyChanged();
  };

  /** convert from data value to element property value */
  protected convert(data: TDataPropValue){
    if (this.valueConverter && this.valueConverter.convert) {
        return this.valueConverter.convert(data);
    }
    return data as any;
  }

  /** convert from element property value to data value */
  protected convertBack(value: TComponentPropValue){
    if (this.valueConverter && this.valueConverter.convertBack) {
        return this.valueConverter.convertBack(value);
    }
    return value as any;
  }
}

export interface IValueChangeBinderProps<T>{
  value: T
  onValueChange: (value: T) => void
}

/** A custom FormBinder that sets 'value' (of type T) and 'onValueChange: (value: T) => void' properties */
export class ValueChangeBinder<T> extends FormBinderBase<IValueChangeBinderProps<T>, T, T>{
  handleValueChanged(props: IValueChangeBinderProps<T>, dataBinder: IDataBinder<any>, notifyChanged: () => void){
    props.onValueChange = (e) => {
      this.onChanged(dataBinder, e, notifyChanged);
    };
  }
}

/** An input FormBinder that sets native 'value' and 'onChange: (e) => void' properties */
export class InputFormBinder<TDataPropValue,TComponentPropValue> extends FormBinderBase<React.DOMAttributes,TDataPropValue,TComponentPropValue> {
  handleValueChanged(props: React.DOMAttributes, dataBinder:IDataBinder<any>, notifyChanged: () => void) {
    props.onChange = (e) => {
      this.onChanged(dataBinder, e.currentTarget[this.propertyGet], notifyChanged);
    };
  }
}

/** A radio input FormBinder */
export class RadioFormBinder<TDataPropValue,TComponentPropValue> extends InputFormBinder<TDataPropValue,TComponentPropValue> {
  setElementProperty(props: React.DOMAttributes, dataBinder:IDataBinder<any>) {
    props["name"] = this.dataName;
    props[this.propertySet] = this.convert(dataBinder.getValue(this.dataName)) === props[this.propertyGet];
  }
}

class KeyboardHelper{
  private static getNumericRegEx(options?: INumericOptions){
    if (options) {
      if (options.allowNegative) {
        if (options.decimals) {
          return /[\d\.\-]/
        }
        return /[\d\-]/
      }

      if (options.decimals) {
        return /[\d\.]/
      }
    }

    return /\d/;
  }

  static numericKeyPress(e: React.KeyboardEvent, options?: INumericOptions){
    const regEx = KeyboardHelper.getNumericRegEx(options)
    const m = e.key.match(regEx);
    if(!m){
      e.preventDefault();
      return;
    }
    if (options) {
      const element = e.currentTarget as HTMLInputElement;
      const selectionStart = element.selectionStart;
      const selectionEnd= element.selectionEnd;
      if (options.allowNegative) {
        const indexOfNegative = element.value.indexOf("-");
        const negativeWillRemove = indexOfNegative >= selectionStart && indexOfNegative < selectionEnd;
        if(m[0] === "-"){
          if (negativeWillRemove) {
            return;
          }
          if (indexOfNegative > -1 || selectionStart > 0) {
            e.preventDefault();
            return;
          }
        } else if(!negativeWillRemove && selectionStart <= indexOfNegative){
          e.preventDefault();
          return;
        }
      }
      if (options.decimals) {
        const indexOfDecimal = element.value.indexOf(".");
        const decimalWillRemove = indexOfDecimal >= selectionStart && indexOfDecimal < selectionEnd;
        if(m[0] === "."){
          if (decimalWillRemove) {
            return;
          }
          if (indexOfDecimal > -1) {
            e.preventDefault();
            return;
          }
        }
      }
    }
  }
}

/** Form Binder helpers */
export class FormBinder {
  static custom<P>(formBinder: IFormBinder<P, any>): IFormBinderInjector<P>{
    return {
      "data-form-binder": formBinder
    };
  }

  /** hidden */
  static hidden<TDataPropValue>(dataName: string, valueConverter?: IInputValueConverter<TDataPropValue>){
    return this.defaultInputFormBinder(dataName,  "hidden", valueConverter)
  }

  /** password */
  static password<TDataPropValue>(dataName: string, valueConverter?: IInputValueConverter<TDataPropValue>){
    return this.defaultInputFormBinder(dataName,  "password", valueConverter)
  }

  /** text */
  static text<TDataPropValue>(dataName: string, valueConverter?: IInputValueConverter<TDataPropValue>){
    return this.defaultInputFormBinder(dataName,  "text", valueConverter)
  }

  /** text 'email' */
  static textEmail<TDataPropValue>(dataName: string, valueConverter?: IInputValueConverter<TDataPropValue>){
    return this.defaultInputFormBinder(dataName,  "email", valueConverter)
  }

  private static defaultInputFormBinder<TDataPropValue, TTo>(dataName: string, type: string, valueConverter?: IValueConverter<TDataPropValue, TTo>, propertySet = "value"){
    let adaptorInjector = FormBinder.custom(new InputFormBinder(dataName, propertySet, valueConverter));
    adaptorInjector["type"] = type;
    return adaptorInjector;
  }

  /** range */
  static range(dataName: string, options?: INumericOptions) {
    let adaptorInjector = FormBinder.custom(new InputFormBinder(dataName, "value"));
    if (options) {
      adaptorInjector["min"] = options.min;
      adaptorInjector["max"] = options.max;
      adaptorInjector["step"] = options.step || 1;
    }
    return adaptorInjector;
  }

  /** uncontroller text input */
  static defaultText<TDataPropValue>(dataName: string, valueConverter?: IInputValueConverter<TDataPropValue>){
    return FormBinder.custom(new InputFormBinder(dataName, "defaultValue", valueConverter, "value"));
  }

  /** numeric text */
  static textNumeric(dataName: string, options?: INumericOptions){
    const converter = options ? new NumericValueConverter(options) : NumericValueConverter.instance;
    let adaptorInjector = this.defaultInputFormBinder(dataName,  "text", converter)
    if (options) {
      adaptorInjector["min"] = options.min
      adaptorInjector["max"] = options.max
    }

    adaptorInjector[dataBinderAttribute].extender = (props: React.HTMLAttributes, ea, nc) => {
      props.onKeyPress = e => KeyboardHelper.numericKeyPress(e, options);
      props.onBlur = e => {
        e.currentTarget["value"] = converter.convert(ea.getValue(dataName));
      };
    };
    return adaptorInjector;
  }

  /** generic select */
  static selectInject<TDataPropValue>(dataName: string, valueConverter?: IInputValueConverter<TDataPropValue>){
    return FormBinder.custom(new InputFormBinder(dataName, "value", valueConverter));
  }

  /** select string */
  static select(dataName: string){
    return FormBinder.selectInject(dataName, DefaultValueConverter.instance);
  }

  /** select number */
  static selectNumeric(dataName: string){
    return FormBinder.selectInject(dataName, NumericValueConverter.instance);
  }

  /** select string id */
  static selectId(dataName: string, convertBack: IOneWayValueConverter<string, IdEntity>);
  static selectId(dataName: string, items: IdEntity[]);
  static selectId(dataName: string, items: any){
    return FormBinder.selectInject(dataName, new IdEntityValueConverter(_.isArray(items) ? EntityItems.itemsId(items): items));
  }

  /** select number id */
  static selectNumericId(dataName: string, convertBack: IOneWayValueConverter<string, NumericIdEntity>);
  static selectNumericId(dataName: string, items: NumericIdEntity[]);
  static selectNumericId(dataName: string, items: any){
    return FormBinder.selectInject(dataName, new NumericIdEntityValueConverter(_.isArray(items) ? EntityItems.itemsNumericId(items): items));
  }

  /** generic checkbox */
  static checkboxInject<TDataPropValue>(/** helooo */dataName: string, valueConverter?: IValueConverter<TDataPropValue, boolean>){
    return this.defaultInputFormBinder(dataName, "checkbox", valueConverter, "checked")
  }

  /** checkbox binding to boolean */
  static checkbox(dataName: string){
    return FormBinder.checkboxInject(dataName);
  }

  /** checkbox binding to boolean derived from trueValue and falseValue equality testing */
  static checkboxConvert<TDataPropValue>(dataName: string, trueValue: TDataPropValue, falseValue: TDataPropValue){
    return FormBinder.checkboxInject(dataName, new CheckboxValueConverter(trueValue, falseValue));
  }

  /** generic input 'radio' */
  static radioInject<TDataPropValue>(dataName: string, value: string, valueConverter: IInputValueConverter<TDataPropValue>){
    let adaptorInjector = FormBinder.custom(new RadioFormBinder(dataName, "checked", valueConverter, "value"));
    adaptorInjector["type"] = "radio";
    adaptorInjector["value"] = value;
    return adaptorInjector;
  }

  /** input 'radio' string value */
  static radio(dataName: string, value: string){
    return FormBinder.radioInject(dataName, value, DefaultValueConverter.instance);
  }

  /** input 'radio' numeric value */
  static radioNumeric(dataName: string, value: number){
    return FormBinder.radioInject(dataName, value.toString(), NumericValueConverter.instance);
  }

  /** input 'radio' item id string value */
  static radioId(dataName: string, value: IdEntity){
    return FormBinder.radioInject(dataName, value.id, new IdValueConverter(v => value.id));
  }

  /** input 'radio' item id string value */
  static radioIdEntity(dataName: string, value: IdEntity){
    return FormBinder.radioInject(dataName, value.id, new IdEntityValueConverter(v => value));
  }

  /** input 'radio' item id numeric value */
  static radioNumericId(dataName: string, value: NumericIdEntity){
    return FormBinder.radioInject(dataName, value.id.toString(), new NumericIdValueConverter(v => value.id));
  }

  /** input 'radio' item id numeric value */
  static radioNumericIdEntity(dataName: string, value: NumericIdEntity){
    return FormBinder.radioInject(dataName, value.id.toString(), new NumericIdEntityValueConverter(v => value));
  }
}
