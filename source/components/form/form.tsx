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

function deepObjectClone<T>(source: T) {
  const target: T = {} as any
  for (var prop in source) {
    if (source.hasOwnProperty(prop)) {
      const value = source[prop]
      if (typeof value === 'object') {
        if (_.isArray(value)) {
          target[prop] = value.map(v => {
            if (typeof v === 'object') {
              return deepObjectClone(v)
            }

            return v;
          }) as any
        } else {
          target[prop] = deepObjectClone(value);
        }
      }
      else {
        target[prop] = source[prop];
      }
    }
  }
  return target;
}

export interface IFormValidationResult{
  /** The attribute (dataPath) of the invalid entry */
  attribute: string

  /** The validation message */
  message: string
}

export interface IFormProps extends React.HTMLProps<Form>{
  /** The forms data binder instance, this contains the data that is used by bound form elements*/
  dataBinder: IDataBinder<any>;

  /** Called when bound form data changes: NOTE, this is called on every key stroke/interaction on any of the bound fields */
  onDataChanged?: (data?: any) => void;

  /** Called when bound form data changes: NOTE, this is called on every key stroke/interaction on any of the bound fields */
  onDataBinderChange?: (dataBinder: IDataBinder<any>) => void;

  /** An optional array of validation results - bound controls whose dataBinder dataPath matches an attribute will be annotated with a 'data-validation-message' property */
  validationResults?: IFormValidationResult[]
}

export interface IFormContext{
  /** The dataBinder of the Form */
  dataBinder: IDataBinder<any>;

  /** If the Form is nested inside another Form, the IFormContext of the parent Form */
  parent: IFormContext
}

/**
A stateless data bindable form - state is held within the 'dataBinder' property
NOTE: This is designed to render all elements in the form on every change. This allows other participating elements to react to these changes
NOTE: This element provides a react context, this can be used to get access to the Forms dataBinder (or any parent Form dataBinder when nested)
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
    return new JsonEntityBinder(data);
  }

  static jsonDataBinderWithClone<T>(data: T): IDataBinder<T>{
    return new JsonEntityBinder(deepObjectClone(data));
  }

  private preventDefault = (e) => { e.preventDefault(); return false }

  render() {
    const ch = this.processChildren(this.props.children);
    const hasParentForm = !!Form.getFormContext(this.context)
    const className = classnames("form", hasParentForm && "form-nested", this.props.className)
    return hasParentForm ? React.DOM.div({ className: className}, ch) : React.DOM.form({className: className, onSubmit: this.preventDefault}, ch)
  }

  private processChildren(node: React.ReactNode){
    const validationResults = this.props.validationResults
    return React.Children.map(node, (element: React.ReactElement<React.HTMLProps<HTMLElement>>) => {
      if (!element){
        return;
      }
      if (!element.props) {
        return element;
      }

      let props: React.DOMAttributes<HTMLElement> = _.extend({}, element.props);
      let children = element.props.children;

      const fbi = props as IFormBinderInjector<any>;
      const formBinder = getFormBinderFromInjector(fbi);
      if (formBinder) {
        updateFormBinderInjector(fbi, null)
        if (validationResults && validationResults.length) {
          const vr = _.find(validationResults, vr => vr.attribute === formBinder.dataPath)
          if (vr) {
            props["data-validation-message"] = vr.message
          }
        }
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
