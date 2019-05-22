import { IDataBinder, IFormBinder } from "./formCore";
import { IValueConverter } from "./formValueConverters";

/**
 * The (abstract) FormBinder, derive from this class to create your own custom FormBinder
 * TComponentProps: The type of the props required on the component being placed inside the form
 * TDataPropValue: The type of the data property being bound
 * TComponentPropValue: The type of the target property being bound on the component
 */
export abstract class FormBinderBase<TComponentProps, TDataPropValue, TComponentPropValue> implements IFormBinder<TComponentProps, any> {
  constructor(
    /** The name of the data property being bound  */
    public dataPath: string,
    /** The name of the component property being bound  */
    protected propertySet: string,
    /** The converter required to convert 'dataName' to 'propertySet' (TDataPropValue to TComponentPropValue) */
    private valueConverter?: IValueConverter<TDataPropValue, TComponentPropValue>,
    /** The name of the property being read from the change event currentTarget */
    protected propertyGet = propertySet,
  ) { }

  /** Sets the React elements properties required in binding */
  setElementProperty(props: TComponentProps, dataBinder: IDataBinder<any>) {
    // tslint:disable-next-line:no-string-literal
    props["name"] = this.dataPath;
    props[this.propertySet] = this.convert(dataBinder.getValue(this.dataPath));
  }

  /** handle the change event, to modify the dataBinder (safely via this.onChanged(...)), then notifyChanged */
  abstract handleValueChanged(props: TComponentProps, dataBinder: IDataBinder<any>, notifyChanged: () => void): void;

  /** convert the value from element to data, set the dataBinder, and notify if changed */
  protected onChanged(dataBinder: IDataBinder<any>, newValue: TComponentPropValue, notifyChanged: () => void) {
    const value = this.convertBack(newValue);
    // if (Formatting.isNullOrUndefined(value)) {
    //   return value;
    // }

    dataBinder.setValue(this.dataPath, value);
    notifyChanged();
  }

  /** convert from data value to element property value */
  protected convert(data: TDataPropValue) {
    if (this.valueConverter && this.valueConverter.convert) {
      return this.valueConverter.convert(data);
    }
    return (data as any) as TComponentPropValue;
  }

  /** convert from element property value to data value */
  protected convertBack(value: TComponentPropValue) {
    if (this.valueConverter && this.valueConverter.convertBack) {
      return this.valueConverter.convertBack(value);
    }
    return (value as any) as TDataPropValue;
  }
}
