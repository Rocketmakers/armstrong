import * as React from "react";
import * as _ from "underscore";
import { IFormBinder, IDataBinder, IFormBinderInjector, getFormBinderFromInjector, updateFormBinderInjector } from "./formCore";
import { IOneWayValueConverter, IValueConverter, IInputValueConverter, CheckboxValueConverter, NumericValueConverter, MultipleNumericValueConverter, INumericOptions, DefaultValueConverter } from "./formValueConverters";
import { FormBinderBase } from "./formBinderBase";
import { ICalendarInputProps } from "./inputs/calendarInput";
import { IDateInputProps } from "./inputs/dateInput";
import { ITimeInputProps } from "./inputs/timeInput";
import { IAutoCompleteInputProps, IAutoCompleteOption } from "./inputs/autoCompleteInput";
import { Formatting } from "../../utilities/formatting";
import { ITagInputProps } from "./inputs/tagInput";
import { ICodeInputProps } from "./inputs/codeInput";

/** An input FormBinder that sets native 'value' and 'onChange: (e) => void' properties */
export class InputFormBinder<TDataPropValue, TComponentPropValue> extends FormBinderBase<React.DOMAttributes<{}>, TDataPropValue, TComponentPropValue> {
  setElementProperty(props: React.DOMAttributes<any>, dataBinder: IDataBinder<any>) {
    super.setElementProperty(props, dataBinder);
    const v = props[this.propertySet];
    if (Formatting.isNullOrUndefined(v)) {
      props[this.propertySet] = this.getDefaultInputValue();
    }
  }

  protected getDefaultInputValue(): any {
    return "";
  }

  handleValueChanged(props: React.DOMAttributes<any>, dataBinder: IDataBinder<any>, notifyChanged: () => void) {
    props.onChange = e => {
      this.onChanged(dataBinder, e.currentTarget[this.propertyGet], notifyChanged);
    };
  }
}

export class SelectMultipleFormBinder<TDataProp> extends InputFormBinder<TDataProp, string[]> {
  constructor(dataPath: string, valueConverter?: IValueConverter<TDataProp, string[]>) {
    super(dataPath, "value", valueConverter);
  }

  setElementProperty(props: React.DOMAttributes<any>, dataBinder: IDataBinder<any>) {
    super.setElementProperty(props, dataBinder);
    props["multiple"] = true;
  }

  handleValueChanged(props: React.DOMAttributes<any>, dataBinder: IDataBinder<any>, notifyChanged: () => void) {
    props.onChange = e => {
      this.onChanged(dataBinder, this.getSelectValues(e.currentTarget), notifyChanged);
    };
  }

  private getSelectValues(select) {
    const result: string[] = [];
    const options = select && select.options;
    if (!options) {
      return result;
    }
    for (let i = 0; i < options.length; i++) {
      let opt = options[i];
      if (opt.selected) {
        result.push(opt.value);
      }
    }
    return result;
  }
}

export class CheckboxFormBinder<TDataPropValue, TComponentPropValue> extends InputFormBinder<TDataPropValue, TComponentPropValue> {
  constructor(dataPath: string, valueConverter?: IValueConverter<TDataPropValue, TComponentPropValue>) {
    super(dataPath, "checked", valueConverter);
  }
  protected getDefaultInputValue() {
    return false;
  }
}

/** A radio input FormBinder */
export class RadioFormBinder<TDataPropValue, TComponentPropValue> extends InputFormBinder<TDataPropValue, TComponentPropValue> {
  setElementProperty(props: React.DOMAttributes<any>, dataBinder: IDataBinder<any>) {
    props["name"] = this.dataPath;
    props[this.propertySet] = this.convert(dataBinder.getValue(this.dataPath)) === props[this.propertyGet];
  }
}

export class DateInputFormBinder extends FormBinderBase<IDateInputProps, string, string> {
  constructor(dataPath: string) {
    super(dataPath, "date");
  }

  handleValueChanged(props: IDateInputProps, dataBinder: IDataBinder<any>, notifyChanged: () => void) {
    props.onChange = e => {
      this.onChanged(dataBinder, e, notifyChanged);
    };
  }
}

export class TimeInputFormBinder extends FormBinderBase<ITimeInputProps, string, string> {
  constructor(dataPath: string) {
    super(dataPath, "time");
  }
  static customValue(dataName: string) {
    return new TimeInputFormBinder(dataName);
  }

  handleValueChanged(props: ITimeInputProps, dataBinder: IDataBinder<any>, notifyChanged: () => void) {
    props.onChange = e => {
      this.onChanged(dataBinder, e, notifyChanged);
    };
  }
}

export class CalendarInputFormBinder extends FormBinderBase<ICalendarInputProps, string, string> {
  constructor(dataPath: string) {
    super(dataPath, "date");
  }

  static customValue(dataName: string) {
    return new CalendarInputFormBinder(dataName);
  }

  handleValueChanged(props: ICalendarInputProps, dataBinder: IDataBinder<any>, notifyChanged: () => void) {
    props.onDateChanged = e => this.onChanged(dataBinder, e, notifyChanged);
  }
}

export class AutoCompleteFormBinder implements IFormBinder<IAutoCompleteInputProps, any> {
  constructor(public dataPath: string, private getItemFromId?: (id: string) => IAutoCompleteOption) { }
  setElementProperty(props: IAutoCompleteInputProps, dataBinder: IDataBinder<any>): void {
    const value = dataBinder.getValue(this.dataPath);
    if (_.isArray(value)) {
      if (this.getItemFromId) {
        props.value = value.map(v => this.getItemFromId(v));
        return;
      }
      props.value = props.options ? props.options.filter(o => value.indexOf(o.id) > -1) : [];
      return;
    }
    if (this.getItemFromId) {
      props.value = this.getItemFromId(value);
      return;
    }

    props.value = props.options && props.options.filter(o => value === o.id)[0];
  }

  handleValueChanged(props: IAutoCompleteInputProps, dataBinder: IDataBinder<any>, notifyChanged: () => void): void {
    props.onSelected = c => {
      if (_.isArray(c)) {
        dataBinder.setValue(this.dataPath, c.map(cc => cc.id));
      } else {
        dataBinder.setValue(this.dataPath, c.id);
      }
      notifyChanged();
    };
  }
}

export class TagInputFormBinder implements IFormBinder<ITagInputProps, any> {
  constructor(public dataPath: string) { }
  setElementProperty(props: ITagInputProps, dataBinder: IDataBinder<any>): void {
    const value = dataBinder.getValue(this.dataPath);
    props.value = value;
  }

  handleValueChanged(props: ITagInputProps, dataBinder: IDataBinder<any>, notifyChanged: () => void): void {
    props.onChange = tags => {
      dataBinder.setValue(this.dataPath, tags);
      notifyChanged()
    };
  }
}

export class CodeInputFormBinder implements IFormBinder<ICodeInputProps, any> {
  constructor(public dataPath: string) { }
  // set the value property of the `SelectInput`
  setElementProperty(props: ICodeInputProps, dataBinder: IDataBinder<any>): void {
    props.value = dataBinder.getValue(this.dataPath)
  }
  // handle the change property of the `SelectInput` - setting the dataBinder value and notifying on change
  handleValueChanged(props: ICodeInputProps, dataBinder: IDataBinder<any>, notifyChanged: () => void): void {
    props.onChange = c => {
      dataBinder.setValue(this.dataPath, c)
      notifyChanged()
    }
  }
}

class ChildrenBinder<TValue, TProps = HTMLElement> implements IFormBinder<TProps, any> {
  constructor(public dataPath: string, private childrenFactory: (value: TValue, props?: TProps, dataBinder?: IDataBinder<any>) => React.ReactNode) { }
  setElementProperty(props: TProps, dataBinder: IDataBinder<any>): void {
  }

  handleValueChanged(props: TProps, dataBinder: IDataBinder<any>, notifyChanged: () => void): void {
  }

  overrideChildren(props: TProps, dataBinder: IDataBinder<any>) {
    return this.childrenFactory(dataBinder.getValue(this.dataPath), props, dataBinder)
  }
}

/** Form Binder helpers */
export class FormBinder {
  /** bind a custom form binder */
  custom<P>(formBinder: IFormBinder<P, any>): IFormBinderInjector<P> {
    return updateFormBinderInjector({} as any, formBinder);
  }

  /** Override the children of the React element - used for label binding */
  children<TValue, TProps = HTMLElement>(name: string, childrenFactory: (value: TValue, props?: TProps, dataBinder?: IDataBinder<any>) => React.ReactNode) {
    return this.custom(new ChildrenBinder<TValue, TProps>(name, childrenFactory));
  }

  /** bind to a 'hidden' input */
  hidden<TDataPropValue>(dataName: string, valueConverter?: IInputValueConverter<TDataPropValue>) {
    return this.defaultInputFormBinder(dataName, "hidden", valueConverter);
  }

  /** bind a string property to a 'password' input */
  password<TDataPropValue>(dataName: string, valueConverter?: IInputValueConverter<TDataPropValue>) {
    return this.defaultInputFormBinder(dataName, "password", valueConverter);
  }

  /** bind a string property to a 'text' input */
  text<TDataPropValue>(dataName: string, valueConverter?: IInputValueConverter<TDataPropValue>) {
    return this.defaultInputFormBinder(dataName, "text", valueConverter);
  }

  /** bind a string property to a 'email' input */
  textEmail<TDataPropValue>(dataName: string, valueConverter?: IInputValueConverter<TDataPropValue>) {
    return this.defaultInputFormBinder(dataName, "email", valueConverter);
  }

  autoCompleteInput(dataName: string, getItemFromId?: (id: string) => IAutoCompleteOption) {
    return this.custom(new AutoCompleteFormBinder(dataName, getItemFromId));
  }

  /** bind a 'value' string array property to a TagInput (e.g. ["cool", "guys", "only"]) */
  tagInput(dataName: string) {
    return this.custom(new TagInputFormBinder(dataName));
  }

  codeInput(dataName: string) {
    return this.custom(new CodeInputFormBinder(dataName));
  }

  /** bind a 'date' string property to a CalendarInput (e.g. YYYY-MM-DD) */
  calendarInput(dataName: string) {
    return this.custom(new CalendarInputFormBinder(dataName));
  }

  /** bind a 'date' string property to a DateInput (e.g. YYYY-MM-DD) */
  dateInput(dataName: string) {
    return this.custom(new DateInputFormBinder(dataName));
  }

  /** bind a 'time' string property to a TimeInput (e.g. HH:MM) */
  timeInput(dataName: string) {
    return this.custom(new TimeInputFormBinder(dataName));
  }

  private defaultInputFormBinder<TDataPropValue, TTo>(dataName: string, type: string, valueConverter?: IValueConverter<TDataPropValue, TTo>, propertySet = "value") {
    let adaptorInjector = this.custom(new InputFormBinder(dataName, propertySet, valueConverter));
    adaptorInjector["type"] = type;
    return adaptorInjector;
  }

  /** bind a number property to a range */
  range(dataName: string, options?: INumericOptions) {
    let adaptorInjector = this.custom(new InputFormBinder(dataName, "value"));
    if (options) {
      adaptorInjector["min"] = options.min;
      adaptorInjector["max"] = options.max;
      adaptorInjector["step"] = options.step || 1;
    }
    return adaptorInjector;
  }

  /** uncontrolled text input */
  defaultText<TDataPropValue>(dataName: string, valueConverter?: IInputValueConverter<TDataPropValue>) {
    return this.custom(new InputFormBinder(dataName, "defaultValue", valueConverter, "value"));
  }

  /** bind a number property to a 'text' input */
  textNumeric(dataName: string, options?: INumericOptions) {
    const converter = options ? new NumericValueConverter(options) : NumericValueConverter.instance;
    let adaptorInjector = this.custom(new InputFormBinder(dataName, "defaultValue", converter, "value"));
    adaptorInjector["type"] = "number";
    adaptorInjector["onKeyDown"] = e => KeyboardHelper.numericKeyPress(e, options);
    if (options) {
      adaptorInjector["min"] = options.min;
      adaptorInjector["max"] = options.max;
    }
    return adaptorInjector;
  }

  /** bind a TDataPropValue property to a select */
  selectCustom<TDataPropValue>(dataName: string, valueConverter?: IInputValueConverter<TDataPropValue>) {
    return this.custom(new InputFormBinder(dataName, "value", valueConverter));
  }

  /** bind a string property to a select */
  select(dataName: string) {
    return this.selectCustom(dataName, DefaultValueConverter.instance);
  }

  /** bind a number property to a select */
  selectNumeric(dataName: string) {
    return this.selectCustom(dataName, NumericValueConverter.instance);
  }

  /** bind a TDataPropValue[] property to a multi select */
  selectMultipleCustom<TDataPropValue>(dataName: string, valueConverter?: IValueConverter<TDataPropValue, string[]>) {
    return this.custom(new SelectMultipleFormBinder(dataName, valueConverter));
  }

  /** bind a string[] property to a multi select */
  selectMultiple(dataName: string) {
    return this.selectMultipleCustom(dataName);
  }

  /** bind a number[] property to a multi select */
  selectMultipleNumeric(dataName: string) {
    return this.selectMultipleCustom(dataName, MultipleNumericValueConverter.instance);
  }

  /** bind a TDataPropValue property to a 'checkbox' input */
  checkboxCustom<TDataPropValue>(dataName: string, valueConverter?: IValueConverter<TDataPropValue, boolean>) {
    let adaptorInjector = this.custom(new CheckboxFormBinder(dataName, valueConverter));
    adaptorInjector["type"] = "checkbox";
    return adaptorInjector;
    //return this.defaultInputFormBinder(dataName, "checkbox", valueConverter, "checked")
  }

  /** bind a boolean property to a 'checkbox' input */
  checkbox(dataName: string) {
    return this.checkboxCustom(dataName);
  }

  /** bind a TDataPropValue property to a 'radio' input, using trueValue and falseValue equality testing */
  checkboxConvert<TDataPropValue>(dataName: string, trueValue: TDataPropValue, falseValue: TDataPropValue) {
    return this.checkboxCustom(dataName, new CheckboxValueConverter(trueValue, falseValue));
  }

  /** bind a TDataPropValue property to a 'radio' input */
  radioCustom<TDataPropValue>(dataName: string, value: string, valueConverter: IInputValueConverter<TDataPropValue>) {
    let adaptorInjector = this.custom(new RadioFormBinder(dataName, "checked", valueConverter, "value"));
    adaptorInjector["type"] = "radio";
    adaptorInjector["value"] = value;
    return adaptorInjector;
  }

  /** bind a string property to a 'radio' input */
  radio(dataName: string, value: string) {
    return this.radioCustom(dataName, value, DefaultValueConverter.instance);
  }

  /** bind a number property to a 'radio' input */
  radioNumeric(dataName: string, value: number) {
    return this.radioCustom(dataName, value.toString(), NumericValueConverter.instance);
  }
}

class KeyboardHelper {
  private static getNumericRegEx(options?: INumericOptions) {
    if (options) {
      if (options.allowNegative) {
        if (options.decimals) {
          return /[\d\.\-]/;
        }
        return /[\d\-]/;
      }

      if (options.decimals) {
        return /[\d\.]/;
      }
    }

    return /\d/;
  }

  static numericKeyPress(e: React.KeyboardEvent<{}>, options?: INumericOptions) {
    const element = e.currentTarget as HTMLInputElement;
    let value = element.value;

    if (e.keyCode === 189 && value.indexOf("-") !== -1) {
      e.preventDefault();
      return;
    }
    if (e.keyCode === 190 && value.indexOf(".") !== -1) {
      e.preventDefault();
      return;
    }
  }
}
