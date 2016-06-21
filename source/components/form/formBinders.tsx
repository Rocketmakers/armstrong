import * as React from "react";
import * as _ from "underscore";
import {IFormBinder,IDataBinder,IFormBinderInjector} from "./formCore";
import {
  IdEntity,
  NumericIdEntity,
  IItemValueConverter,
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
  static itemsId(items: IdEntity[]): IItemValueConverter<string, IdEntity>{
    return value => _.find(items, i => i.id.toString() === value)
  }
  static itemsNumericId(items: NumericIdEntity[]): IItemValueConverter<string, NumericIdEntity>{
    return value => _.find(items, i => i.id.toString() === value);
  }
}

export abstract class FormBinderBase<P,D,V> implements IFormBinder<P, any> {
  constructor(
    protected dataName: string,
    protected propertySet: string,
    private valueConverter?: IValueConverter<D, V>,
    protected propertyGet = propertySet){
  }

  setElementProperty(props: P, dataBinder:IDataBinder<any>) {
    props["name"] = this.dataName;
    props[this.propertySet] = this.convert(dataBinder.getValue(this.dataName));
  }

  abstract handleValueChanged(props: P, dataBinder:IDataBinder<any>, notifyChanged: () => void): void;

  protected onChanged(dataBinder:IDataBinder<any>, newValue: V, notifyChanged: () => void) {
    const value = this.convertBack(newValue);
    if (_.isUndefined(value)) {
      return;
    }

    dataBinder.setValue(this.dataName, value);
    notifyChanged();
  };

  protected convert(data: D){
    if (this.valueConverter && this.valueConverter.convert) {
        return this.valueConverter.convert(data);
    }
    return data as any;
  }

  protected convertBack(value: V){
    if (this.valueConverter && this.valueConverter.convertBack) {
        return this.valueConverter.convertBack(value);
    }
    return value as any;
  }
}

export class InputFormBinder<D,V> extends FormBinderBase<React.DOMAttributes,D,V> {
  handleValueChanged(props: React.DOMAttributes, dataBinder:IDataBinder<any>, notifyChanged: () => void) {
    props.onChange = (e) => {
      this.onChanged(dataBinder, e.currentTarget[this.propertyGet], notifyChanged);
    };
  }
}

export class RadioFormBinder<D,V> extends InputFormBinder<D,V> {
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

export class FormBinder {
  static custom<P>(formBinder: IFormBinder<P, any>): IFormBinderInjector<P>{
    return {
      __formBinder: formBinder
    };
  }

  static hidden<D>(dataName: string, valueConverter?: IInputValueConverter<D>){
    let adaptorInjector = FormBinder.custom(new InputFormBinder(dataName, "value", valueConverter));
    adaptorInjector["type"] = "hidden";
    return adaptorInjector;
  }

  static password<D>(dataName: string, valueConverter?: IInputValueConverter<D>){
    let adaptorInjector = FormBinder.custom(new InputFormBinder(dataName, "value", valueConverter));
    adaptorInjector["type"] = "password";
    return adaptorInjector;
  }

  static text<D>(dataName: string, valueConverter?: IInputValueConverter<D>){
    let adaptorInjector = FormBinder.custom(new InputFormBinder(dataName, "value", valueConverter));
    adaptorInjector["type"] = "text";
    return adaptorInjector;
  }

  static textEmail<D>(dataName: string, valueConverter?: IInputValueConverter<D>){
    let adaptorInjector = FormBinder.custom(new InputFormBinder(dataName, "value", valueConverter));
    adaptorInjector["type"] = "email";
    return adaptorInjector;
  }

  static range(dataName: string, options?: INumericOptions) {
    let adaptorInjector = FormBinder.custom(new InputFormBinder(dataName, "value"));
    if (options) {
      adaptorInjector["min"] = options.min;
      adaptorInjector["max"] = options.max;
      adaptorInjector["step"] = options.step || 1;
    }
    return adaptorInjector;
  }

  static defaultText<D>(dataName: string, valueConverter?: IInputValueConverter<D>){
    return FormBinder.custom(new InputFormBinder(dataName, "defaultValue", valueConverter, "value"));
  }

  static textNumeric(dataName: string, options?: INumericOptions){
    const converter = new NumericValueConverter(options);
    let adaptorInjector = FormBinder.custom(new InputFormBinder(dataName, "value", converter));
    adaptorInjector["type"] = "text";
    adaptorInjector["min"] = options ? options.min : null;
    adaptorInjector["max"] = options ? options.max : null;
    adaptorInjector.__formBinder.extender = (props: React.HTMLAttributes, ea, nc) => {
      props.onKeyPress = e => KeyboardHelper.numericKeyPress(e, options);
      props.onBlur = e => {
        e.currentTarget["value"] = converter.convert(ea.getValue(dataName));
      };
    };
    return adaptorInjector;
  }

  static selectInject<D>(dataName: string, valueConverter?: IInputValueConverter<D>){
    return FormBinder.custom(new InputFormBinder(dataName, "value", valueConverter));
  }

  static select(dataName: string){
    return FormBinder.selectInject(dataName, DefaultValueConverter.instance);
  }

  static selectNumeric(dataName: string){
    return FormBinder.selectInject(dataName, new NumericValueConverter());
  }

  static selectId(dataName: string, convertBack: IItemValueConverter<string, IdEntity>);
  static selectId(dataName: string, items: IdEntity[]);
  static selectId(dataName: string, items: any){
    const convertBack:IItemValueConverter<string, IdEntity> = _.isArray(items) ? EntityItems.itemsId(items): items;
    return FormBinder.selectInject(dataName, new IdEntityValueConverter(convertBack));
  }

  static selectNumericId(dataName: string, convertBack: IItemValueConverter<string, NumericIdEntity>);
  static selectNumericId(dataName: string, items: NumericIdEntity[]);
  static selectNumericId(dataName: string, items: any){
    const convertBack:IItemValueConverter<string, NumericIdEntity> = _.isArray(items) ? EntityItems.itemsNumericId(items): items;
    return FormBinder.selectInject(dataName, new NumericIdEntityValueConverter(convertBack));
  }

  static checkboxInject<D>(dataName: string, valueConverter?: IValueConverter<D, boolean>){
    let adaptorInjector = FormBinder.custom(new InputFormBinder(dataName, "checked", valueConverter));
    adaptorInjector["type"] = "checkbox";
    return adaptorInjector;
  }

  static checkbox(dataName: string){
    return FormBinder.checkboxInject(dataName);
  }

  static checkboxConvert<D>(dataName: string, trueValue: D, falseValue: D){
    return FormBinder.checkboxInject(dataName, new CheckboxValueConverter(trueValue, falseValue));
  }

  static radioInject<D>(dataName: string, value: string, valueConverter: IInputValueConverter<D>){
    let adaptorInjector = FormBinder.custom(new RadioFormBinder(dataName, "checked", valueConverter, "value"));
    adaptorInjector["type"] = "radio";
    adaptorInjector["value"] = value;
    return adaptorInjector;
  }

  static radio(dataName: string, value: string){
    return FormBinder.radioInject(dataName, value, DefaultValueConverter.instance);
  }

  static radioNumeric(dataName: string, value: number){
    return FormBinder.radioInject(dataName, value.toString(), new NumericValueConverter());
  }

  static radioId(dataName: string, value: IdEntity){
    return FormBinder.radioInject(dataName, value.id, new IdValueConverter(v => value.id));
  }

  static radioIdEntity(dataName: string, value: IdEntity){
    return FormBinder.radioInject(dataName, value.id, new IdEntityValueConverter(v => value));
  }

  static radioNumericIdEntity(dataName: string, value: NumericIdEntity){
    return FormBinder.radioInject(dataName, value.id.toString(), new NumericIdEntityValueConverter(v => value));
  }

  static radioNumericId(dataName: string, value: NumericIdEntity){
    return FormBinder.radioInject(dataName, value.id.toString(), new NumericIdValueConverter(v => value.id));
  }
}
