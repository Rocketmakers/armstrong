import * as React from "react";

/**
Form Binder Core interface
The defintion of a form binder
*/
export interface IFormBinder<TComponentProps, TData>{
  /**
  Augment the component props that will be applied to the forms child element being bound
  */
  setElementProperty(props: TComponentProps, dataBinder:IDataBinder<TData>): void;

  /**
  Add the value changed event handler, calling the supplied `notifyChanged` function when a change event has occured
  */
  handleValueChanged(props: TComponentProps, dataBinder:IDataBinder<TData>, notifyChanged: () => void): void;

  /**
  An optional additional set of component props that allows consumers of your FormBinder to add, change or remove the properties that will be applied to the target element
  */
  extender?(props: TComponentProps, dataBinder:IDataBinder<TData>, notifyChanged: () => void): void;
}

/**
The Form Data Binder Core interface
Wraps access to the data being bound to the form.
This provides the bridge between the data source and the form elements
*/
export interface IDataBinder<T>{
  /** Gets a value for the data path (uses dot notation)*/
  getValue(dataPath: string): any;
  /** Sets a value for the data path (uses dot notation)*/
  setValue(dataPath: string, value: any): void;
  /** Gets the inner data as the native object*/
  toJson(): T;
}

const FormBinderInjectorKey = "data-form-binder"
/** Used to inject properties onto React components to permit form binding */
export interface IFormBinderInjector<TComponentProps>{
  "data-form-binder": IFormBinder<TComponentProps, any>
}

export function getFormBinderFromInjector<TComponentProps>(injector: IFormBinderInjector<TComponentProps>): IFormBinder<TComponentProps, any> {
  return injector[FormBinderInjectorKey]
}

export function updateFormBinderInjector<TComponentProps>(target: IFormBinderInjector<TComponentProps>, formBinder: IFormBinder<TComponentProps, any>): IFormBinderInjector<TComponentProps> {
    target[FormBinderInjectorKey] = formBinder
    return target
}

export function getEventTargetAs<T extends HTMLElement>(evt: React.FormEvent<any>) {
    return evt.target as T
}
