import * as React from "react";

export interface IFormBinder<P, D>{
  setElementProperty(props: P, dataBinder:IDataBinder<D>): void;
  handleValueChanged(props: P, dataBinder:IDataBinder<D>, notifyChanged: () => void): void;
  extender?(props: P, dataBinder:IDataBinder<D>, notifyChanged: () => void): void;
}

export interface IDataBinder<T>{
  getValue(dataName: string): any;
  setValue(dataName: string, value: any): void;
  toJson(): T;
}

export interface IFormBinderInjector<P>{
  __formBinder: IFormBinder<P, any>
}
