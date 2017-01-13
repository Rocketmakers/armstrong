import * as React from "react";
import * as _ from "underscore";
import {IFormBinder,IDataBinder,IFormBinderInjector,getFormBinderFromInjector,updateFormBinderInjector} from "./formCore";
import {
  IOneWayValueConverter,
  IValueConverter,
  IInputValueConverter,
  CheckboxValueConverter,
  NumericValueConverter,
  INumericOptions,
  DefaultValueConverter
  } from "./formValueConverters";
import {FormBinderBase} from "./formBinderBase";
import {ICalendarInputProps} from "./inputs/calendarInput";
import {IDateInputProps} from "./inputs/dateInput";
import {ITimeInputProps} from "./inputs/timeInput";
import {IAutoCompleteInputProps} from "./inputs/autoCompleteInput";
import {Formatting} from "../../utilities/formatting";

/** An input FormBinder that sets native 'value' and 'onChange: (e) => void' properties */
export class InputFormBinder<TDataPropValue,TComponentPropValue> extends FormBinderBase<React.DOMAttributes<{}>,TDataPropValue,TComponentPropValue> {
  setElementProperty(props: React.DOMAttributes<any>, dataBinder:IDataBinder<any>) {
    super.setElementProperty(props, dataBinder)
    const v = props[this.propertySet];
    if (Formatting.isNullOrUndefined(v)) {
      props[this.propertySet] = this.getDefaultInputValue()
    }
  }

  protected getDefaultInputValue() : any{
    return ""
  }

  handleValueChanged(props: React.DOMAttributes<any>, dataBinder:IDataBinder<any>, notifyChanged: () => void) {
    props.onChange = (e) => {
      this.onChanged(dataBinder, e.currentTarget[this.propertyGet], notifyChanged);
    };
  }
}

export class CheckboxFormBinder<TDataPropValue,TComponentPropValue> extends InputFormBinder<TDataPropValue,TComponentPropValue>{
  protected getDefaultInputValue(){
    return false
  }
}

/** A radio input FormBinder */
export class RadioFormBinder<TDataPropValue,TComponentPropValue> extends InputFormBinder<TDataPropValue,TComponentPropValue> {
  setElementProperty(props: React.DOMAttributes<any>, dataBinder:IDataBinder<any>) {
    props["name"] = this.dataName;
    props[this.propertySet] = this.convert(dataBinder.getValue(this.dataName)) === props[this.propertyGet];
  }
}

export class DateInputFormBinder extends FormBinderBase<IDateInputProps, string, string>{
  constructor(dataName: string){
    super(dataName, "date")
  }

  handleValueChanged(props: IDateInputProps, dataBinder:IDataBinder<any>, notifyChanged: () => void) {
    props.onChange = (e) => {
      this.onChanged(dataBinder, e, notifyChanged);
    };
  }
}

export class TimeInputFormBinder extends FormBinderBase<ITimeInputProps, string, string>{
  constructor(dataName: string){
    super(dataName, "time")
  }
  static customValue(dataName: string){
    return new TimeInputFormBinder(dataName);
  }

  handleValueChanged(props: ITimeInputProps, dataBinder:IDataBinder<any>, notifyChanged: () => void) {
    props.onChange = (e) => {
      this.onChanged(dataBinder, e, notifyChanged);
    };
  }
}

export class CalendarInputFormBinder extends FormBinderBase<ICalendarInputProps, string, string>{
  constructor(dataName: string){
    super(dataName, "date")
  }

  static customValue(dataName: string) {
    return new CalendarInputFormBinder(dataName);
  }

  handleValueChanged(props: ICalendarInputProps, dataBinder: IDataBinder<any>, notifyChanged: () => void) {
    props.onDateChanged = (e) => this.onChanged(dataBinder, e, notifyChanged);
  }
}

export class AutoCompleteFormBinder implements IFormBinder<IAutoCompleteInputProps, any> {
  constructor(private dataPath: string){}
  setElementProperty(props: IAutoCompleteInputProps, dataBinder: IDataBinder<any>): void{
    const value = dataBinder.getValue(this.dataPath);
    if (_.isArray(value)) {
      props.value = props.options ? props.options.filter(o => value.indexOf(o.id) > -1) : []
      return
    }

    props.value = props.options && props.options.filter(o => value === o.id)[0]
  }

  handleValueChanged(props: IAutoCompleteInputProps, dataBinder: IDataBinder<any>, notifyChanged: () => void): void{
    props.onSelected = c => {
      if (_.isArray(c)) {
        dataBinder.setValue(this.dataPath, c.map(cc => cc.id))
      }
      else{
        dataBinder.setValue(this.dataPath, c.id)
      }
      notifyChanged()
    }
  }
}

/** Form Binder helpers */
export class FormBinder {
  static custom<P>(formBinder: IFormBinder<P, any>): IFormBinderInjector<P>{
    return updateFormBinderInjector({} as any, formBinder)
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

  static autoCompleteInput(dataName: string){
    return FormBinder.custom(new AutoCompleteFormBinder(dataName));
  }

  static calendarInput(dataName: string){
    return FormBinder.custom(new CalendarInputFormBinder(dataName));
  }

  static dateInput(dataName: string){
    return FormBinder.custom(new DateInputFormBinder(dataName));
  }

  static timeInput(dataName: string){
    return FormBinder.custom(new TimeInputFormBinder(dataName));
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

    getFormBinderFromInjector(adaptorInjector).extender = (props: React.HTMLAttributes<any>, ea, nc) => {
      props.onKeyPress = e => KeyboardHelper.numericKeyPress(e, options);
      props.onBlur = e => {
        e.currentTarget["value"] = converter.convert(ea.getValue(dataName));
      };
    };
    return adaptorInjector;
  }

  /** generic select */
  static selectCustom<TDataPropValue>(dataName: string, valueConverter?: IInputValueConverter<TDataPropValue>){
    return FormBinder.custom(new InputFormBinder(dataName, "value", valueConverter));
  }

  /** select string */
  static select(dataName: string){
    return FormBinder.selectCustom(dataName, DefaultValueConverter.instance);
  }

  /** select number */
  static selectNumeric(dataName: string){
    return FormBinder.selectCustom(dataName, NumericValueConverter.instance);
  }

  /** generic checkbox */
  static checkboxCustom<TDataPropValue>(/** helooo */dataName: string, valueConverter?: IValueConverter<TDataPropValue, boolean>){
    let adaptorInjector = FormBinder.custom(new CheckboxFormBinder(dataName, "value", valueConverter, "checked"));
    adaptorInjector["type"] = "checkbox";
    return adaptorInjector;
    //return this.defaultInputFormBinder(dataName, "checkbox", valueConverter, "checked")
  }

  /** checkbox binding to boolean */
  static checkbox(dataName: string){
    return FormBinder.checkboxCustom(dataName);
  }

  /** checkbox binding to boolean derived from trueValue and falseValue equality testing */
  static checkboxConvert<TDataPropValue>(dataName: string, trueValue: TDataPropValue, falseValue: TDataPropValue){
    return FormBinder.checkboxCustom(dataName, new CheckboxValueConverter(trueValue, falseValue));
  }

  /** generic input 'radio' */
  static radioCustom<TDataPropValue>(dataName: string, value: string, valueConverter: IInputValueConverter<TDataPropValue>){
    let adaptorInjector = FormBinder.custom(new RadioFormBinder(dataName, "checked", valueConverter, "value"));
    adaptorInjector["type"] = "radio";
    adaptorInjector["value"] = value;
    return adaptorInjector;
  }

  /** input 'radio' string value */
  static radio(dataName: string, value: string){
    return FormBinder.radioCustom(dataName, value, DefaultValueConverter.instance);
  }

  /** input 'radio' numeric value */
  static radioNumeric(dataName: string, value: number){
    return FormBinder.radioCustom(dataName, value.toString(), NumericValueConverter.instance);
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

  static numericKeyPress(e: React.KeyboardEvent<{}>, options?: INumericOptions){
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
