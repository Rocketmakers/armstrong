import * as React from "react";
import { IArrayProp, IObjectProp, PropType } from "./propertyPathBuilder";

export type ValidationModes = "none" | "icon" | "below" | "both";

export namespace DataValidationMessage {
  const attributeName = "data-validation-message"
  export function spread(message: string): { ["data-validation-message"]: string } {
    return { [attributeName]: message }
  }
  export function set(props, message: string) {
    props[attributeName] = message
  }
  export function get(props): string {
    return props[attributeName]
  }
}

export namespace DataValidationMode {
  const attributeName = "data-validation-mode"
  export function spread(mode: ValidationModes): { ["data-validation-mode"]: ValidationModes } {
    return { [attributeName]: mode }
  }

  export function set(props, mode: ValidationModes) {
    props[attributeName] = mode
  }

  export function get(props): ValidationModes {
    return props[attributeName] || "none"
  }
}

export interface IFormValidationResult {
  /** The attribute (dataPath) of the invalid entry */
  attribute: string;

  /** The validation message */
  message: string;
}

/**
 * Form Binder Core interface
 * The defintion of a form binder
 */
export interface IFormBinder<TComponentProps, TData> {
  /** The path used to bind to the data object */
  dataPath: string

  /**
   * Augment the component props that will be applied to the forms child element being bound
   */
  setElementProperty(props: TComponentProps, dataBinder: IDataBinder<TData>, validationResults?: IFormValidationResult[]): void;

  /**
   * Add the value changed event handler, calling the supplied `notifyChanged` function when a change event has occurred
   */
  handleValueChanged(props: TComponentProps, dataBinder: IDataBinder<TData>, notifyChanged: () => void): void;

  /**
   * Override the children for the element
   */
  overrideChildren?(props: TComponentProps, dataBinder: IDataBinder<TData>): React.ReactNode

  /**
   * An optional additional set of component props that allows consumers of your FormBinder to add, change or remove the properties that will be applied to the target element
   */
  extender?(props: TComponentProps, dataBinder: IDataBinder<TData>, notifyChanged: () => void): void;
}

/**
 * The Form Data Binder Core interface
 * Wraps access to the data being bound to the form.
 * This provides the bridge between the data source and the form elements
 */
export interface IDataBinder<T> {
  lastDataPathSet?: string
  /** Gets a value for the key name (does NOT use dot notation) */
  getKeyValue<X>(dataName: (builder: PropType<T>) => IObjectProp<X>): X
  getKeyValue<X>(dataName: (builder: PropType<T>) => IArrayProp<X>): X[]
  getKeyValue<TKey extends keyof T>(keyName: TKey): T[TKey];
  /** Sets a value for the key name (does NOT use dot notation) */
  setKeyValue<X>(dataName: (builder: PropType<T>) => IObjectProp<X>, value: X): void
  setKeyValue<X>(dataName: (builder: PropType<T>) => IArrayProp<X>, value: X[]): void
  setKeyValue<TKey extends keyof T>(keyName: TKey, value: T[TKey]): void;
  /** Gets a value for the data path (uses dot notation) */
  getValue(dataPath: string): any;
  /** Sets a value for the data path (uses dot notation) */
  setValue(dataPath: string, value: any): void;
  /** Gets the inner data as the native object */
  toJson(): T;

  createChildBinder<X>(dataName: (builder: PropType<T>) => IObjectProp<X>, autoSync?: boolean): IChildDataBinder<X>
  createChildBinder<X>(dataName: (builder: PropType<T>) => IArrayProp<X>, autoSync?: boolean): IChildDataBinder<X[]>
  createChildBinder<TKey extends keyof T>(keyName: TKey, autoSync?: boolean): IChildDataBinder<T[TKey]>
}

export interface IChildDataBinder<T> extends IDataBinder<T> {
  sync(): void
}

const FormBinderInjectorKey = "data-form-binder"
/** Used to inject properties onto React components to permit form binding */
export interface IFormBinderInjector<TComponentProps> {
  [FormBinderInjectorKey]: IFormBinder<TComponentProps, any>
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
