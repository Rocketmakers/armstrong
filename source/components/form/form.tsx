import * as React from "react";
import * as _ from "underscore";
import {IFormBinder,IDataBinder,IFormBinderInjector} from "./formCore";
import {FormBinder} from "./formBinders";

class JsonEntityBinder<T> implements IDataBinder<T>{
  constructor(private data: T){}
  getValue(dataName: string): any{
    const parts = dataName.split(".");
    var d = _.reduce(parts, (result,p:string)=>{
      if (!result){
        throw new Error(`${p} not found in data`);
      }
      return result[p]
    }, this.data);

    return d;
  }

  setValue(dataName: string, value: any): void{
    const parts = dataName.split(".");
    var d = this.data;
    for (let i = 0; i < parts.length - 1; i++) {
        d = d[parts[i]];
    }
    d[parts[parts.length - 1]] = value;
  }

  toJson(): T{
    return this.data;
  }
}

export interface IForm extends React.HTMLProps<Form>{
  dataBinder: IDataBinder<any>;
  onDataChanged: (data?: any) => void;
}

export class Form extends React.Component<IForm,{}>{

  static Bind = FormBinder;
  static jsonDataBinder<T>(data: T): IDataBinder<T>{
    return new JsonEntityBinder(data);
  }

  render() {
    const ch = this.processChildren(this.props.children);
    return (
      <form className={`form ${this.props.className}`} onSubmit={(e) => { e.preventDefault(); return false }}>
      {ch}
      </form>
    );
  }

  private processChildren(node: React.ReactNode){
    return React.Children.map(node, (element: React.ReactElement<React.HTMLProps<HTMLElement>>) => {
      if (!element){
        return;
      }
      if (!element.props) {
        return element;
      }

      let props: React.DOMAttributes = _.extend({}, element.props);
      let children = element.props.children;

      const fbi = props as IFormBinderInjector<any>;
      const formBinder = fbi.__formBinder;
      if (formBinder) {
        delete fbi.__formBinder
        formBinder.setElementProperty(props, this.props.dataBinder);
        formBinder.handleValueChanged(props, this.props.dataBinder, () => this.notifyChange());
        if (formBinder.extender) {
          formBinder.extender(props, this.props.dataBinder, () => this.notifyChange());
        }
      } else if (children) {
        children = this.processChildren(children);
      }

      return React.cloneElement<any, any>(element, props, children);
    })
  }

  private notifyChange(){
    this.props.onDataChanged(this.props.dataBinder.toJson());
  }
}
