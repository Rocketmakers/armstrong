import * as React from "react";

/** Form Binder Core interface */
export interface IFormBinder<TComponentProps, TDataPropValue>{
  setElementProperty(props: TComponentProps, dataBinder:IDataBinder<TDataPropValue>): void;
  handleValueChanged(props: TComponentProps, dataBinder:IDataBinder<TDataPropValue>, notifyChanged: () => void): void;
  extender?(props: TComponentProps, dataBinder:IDataBinder<TDataPropValue>, notifyChanged: () => void): void;
}

/** Form Data Binder Core interface */
export interface IDataBinder<T>{
  getValue(dataName: string): any;
  setValue(dataName: string, value: any): void;
  toJson(): T;
}

export const dataBinderAttribute = "data-form-binder"

/** Used to inject properties onto React components to permit change handling */
export interface IFormBinderInjector<TComponentProps>{
  "data-form-binder": IFormBinder<TComponentProps, any>
}
