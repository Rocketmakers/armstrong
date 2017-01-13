import * as React from "react";
import * as _ from "underscore";
import {IFormBinder,IDataBinder,IFormBinderInjector,getFormBinderFromInjector,updateFormBinderInjector} from "./formCore";
import {FormBinder} from "./formBinders";
import {PropertyPathResolver} from "./properyPathResolver";
import * as classnames from "classnames";

/** The default Json Entity binder - NOTE, the original instance provided is MUTABLE */
class JsonEntityBinder<T> implements IDataBinder<T>{
  constructor(private data: T){}
  getValue(dataName: string): any{
    return PropertyPathResolver.getValue(this.data, dataName)
  }

  setValue(dataName: string, value: any): void{
    PropertyPathResolver.setValue(this.data, dataName, value)
  }

  toJson(): T{
    return this.data;
  }
}

function deepObjectExtend (target, source) {
    for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
            if (target[prop] && typeof source[prop] === 'object') {
                deepObjectExtend(target[prop], source[prop]);
            }
            else {
                target[prop] = source[prop];
            }
        }
    }
    return target;
}

export interface IFormProps extends React.HTMLProps<Form>{
  /** The forms data binder instance, this contains the data that is used by bound form elements*/
  dataBinder: IDataBinder<any>;

  /** Called when bound form data changes: NOTE, this is called on every key stroke/interaction on any of the bound fields */
  onDataChanged?: (data?: any) => void;

  /** Called when bound form data changes: NOTE, this is called on every key stroke/interaction on any of the bound fields */
  onDataBinderChange?: (dataBinder: IDataBinder<any>) => void;
}

export interface IFormContext{
  dataBinder: IDataBinder<any>;
  parent: IFormContext
}

/**
A stateless data bindable form - state is held within the 'dataBinder' property
NOTE: This is designed to render all elements in the form on every change. This allows other participating elements to react to these changes
NOTE: This element provides a react context, this can be used to get access to any parent (or parent's with nested forms) data binder
*/
export class Form extends React.Component<IFormProps,{}>{

  static contextTypes = {"form": React.PropTypes.object}

  static getFormContext(context: any){
    return context["form"] as IFormContext
  }

  getChildContext() {
      return {
        form: {
          dataBinder: this.props.dataBinder,
          parent: this.context["form"]
        } as IFormContext
      };
  }

  static childContextTypes = {
    form: React.PropTypes.object
  };

  static Bind = FormBinder;
  static jsonDataBinder<T>(data: T): IDataBinder<T>{
    return new JsonEntityBinder(deepObjectExtend({}, data));
  }

  private preventDefault = (e) => { e.preventDefault(); return false }

  render() {
    const ch = this.processChildren(this.props.children);
    const hasParentForm = !!Form.getFormContext(this.context)
    const className = classnames("form", hasParentForm && "form-nested", this.props.className)
    return hasParentForm ? React.DOM.div({ className: className}, ch) : React.DOM.form({className: className, onSubmit: this.preventDefault}, ch)
  }

  private processChildren(node: React.ReactNode){
    return React.Children.map(node, (element: React.ReactElement<React.HTMLProps<HTMLElement>>) => {
      if (!element){
        return;
      }
      if (!element.props) {
        return element;
      }

      let props: React.DOMAttributes<{}> = _.extend({}, element.props);
      let children = element.props.children;

      const fbi = props as IFormBinderInjector<any>;
      const formBinder = getFormBinderFromInjector(fbi);
      if (formBinder) {
        updateFormBinderInjector(fbi, null)
        formBinder.setElementProperty(props, this.props.dataBinder);
        formBinder.handleValueChanged(props, this.props.dataBinder, this.notifyChange);
        if (formBinder.extender) {
          formBinder.extender(props, this.props.dataBinder, this.notifyChange);
        }
      } else if (children) {
        children = this.processChildren(children);
      }

      return React.cloneElement<any, any>(element, props, children);
    })
  }

  private notifyChange = () => {
    this.props.onDataBinderChange && this.props.onDataBinderChange(this.props.dataBinder)
    this.props.onDataChanged && this.props.onDataChanged(this.props.dataBinder.toJson())
  }
}
