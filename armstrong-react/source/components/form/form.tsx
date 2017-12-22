import * as React from "react";
import * as ReactDOM from "react-dom";
import { PropTypes } from "prop-types";
import * as _ from "underscore";
import { IFormBinder, IDataBinder, IFormBinderInjector, getFormBinderFromInjector, updateFormBinderInjector, IFormValidationResult, DataValidationMessage } from "./formCore";
import { FormBinder } from "./formBinders";
import { PropertyPathResolver } from "./propertyPathResolver";
import { ClassHelpers } from "../../utilities/classNames";

/** The default Json Entity binder - NOTE, the original instance provided is MUTABLE */
class JsonEntityBinder<T> implements IDataBinder<T> {
  constructor(private data: T) { }
  lastDataPathSet?: string;

  getKeyValue = <TKey extends keyof T>(keyName: TKey): T[TKey] => {
    return this.data[keyName];
  };

  setKeyValue = <TKey extends keyof T>(keyName: TKey, value: T[TKey]): void => {
    this.data[keyName] = value;
  };

  getValue = (dataPath: string): any => {
    return PropertyPathResolver.getValue(this.data, dataPath);
  };

  setValue = (dataPath: string, value: any): void => {
    PropertyPathResolver.setValue(this.data, dataPath, value);
    this.lastDataPathSet = dataPath;
  };

  toJson = (): T => {
    return this.data;
  };
}

export class FormDataClone {
  static json<T>(source: T) {
    return JSON.parse(JSON.stringify(source)) as T;
  }

  static custom<T>(source: T) {
    const clone = _.clone(source);
    _.keys(clone).map(key => {
      const value = clone[key];
      if (_.isObject(value)) {
        clone[key] = FormDataClone.custom(value);
      }
    });

    return clone;
  }
}

export function generateUniqueId(formatter?: (unique: string) => string) {
  const u = `${Math.random()}`;
  return formatter ? formatter(u) : u;
}

export type ValidationModes = "none" | "icon" | "below" | "both";

export type ValidationProps = {
  /** (string) How to display validation messages */
  validationMode?: ValidationModes;
};

export type IFormInputProps<T> = React.Props<T> & ValidationProps;

export type IFormInputHTMLProps<T, E = React.HTMLAttributes<HTMLElement>> = React.ClassAttributes<T> & E & ValidationProps;

export interface IFormCoreProps {
  /** The forms data binder instance, this contains the data that is used by bound form elements*/
  dataBinder: IDataBinder<any>;

  /** An optional array of validation results - bound controls whose dataBinder dataPath matches an attribute will be annotated with a 'data-validation-message' property */
  validationResults?: IFormValidationResult[];

  /** (string) How to display validation messages. 'icon' (default) shows a small exclamation symbol in the right of the field, 'below' shows the message below the field, while 'both' is a combination, and none hides all validation UI */
  validationMode?: ValidationModes
}

export interface IFormProps extends React.HTMLProps<Form>, IFormCoreProps {
  /** Called when bound form data changes: NOTE, this is called on every key stroke/interaction on any of the bound fields */
  onDataChanged?: (data?: any) => void;

  /** Called when bound form data changes: NOTE, this is called on every key stroke/interaction on any of the bound fields */
  onDataBinderChange?: (dataBinder: IDataBinder<any>) => void;

  /** (boolean) Automatically focus the first input (if it's empty) when the form is rendered */
  focusFirstEmptyInput?: boolean;
}

export interface IFormContext {
  /** The dataBinder of the Form */
  dataBinder: IDataBinder<any>;

  /** The core properties of the form */
  coreProps: IFormCoreProps

  /** Notifies any change made to the bound form data */
  notifyChange: () => void

  /** If the Form is nested inside another Form, the IFormContext of the parent Form */
  parent: IFormContext;
}

export function extractChildValidationResults(validationResults: IFormValidationResult[], dataPath: string) {
  const vr = validationResults && _.filter(validationResults, vr => vr.attribute.indexOf(dataPath + ".") === 0);
  if (!vr) {
    return;
  }

  return vr.map(a => ({ ...a, attribute: a.attribute.substring(dataPath.length + 1) }));
}

export class ParentFormContext extends React.Component {
  static contextTypes = { form: PropTypes.object };

  render() {
    const context = Form.getFormContext(this.context)
    if (!context){
      console.error("A ParentFormBinder should be rendered within the context of a parent Form")
    }
    
    const children = context ? FormElementProcessor.processChildren(context.coreProps, this.props.children, context.notifyChange) : this.props.children;

    return (
      <>
      {children}
      </>
    )
  }
}

/**
A stateless data bindable form - state is held within the 'dataBinder' property
NOTE: This is designed to render all elements in the form on every change. This allows other participating elements to react to these changes
NOTE: This element provides a react context, this can be used to get access to the Forms dataBinder (or any parent Form dataBinder when nested)
*/
export class Form extends React.Component<IFormProps, {}> {
  private formDom: HTMLElement;

  static defaultProps: Partial<IFormProps> = {
    validationMode: "icon"
  };

  static contextTypes = { form: PropTypes.object };

  static getFormContext(context: any) {
    return context["form"] as IFormContext;
  }

  componentDidMount() {
    if (this.props.focusFirstEmptyInput) {
      let f = this.formDom;
      let inputs = f.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input[type=text]:not(:disabled), textarea");
      if (inputs[0] && !inputs[0].value) {
        inputs[0].focus();
      }
    }
  }

  getChildContext(): { form: IFormContext } {
    return {
      form: {
        dataBinder: this.props.dataBinder,
        coreProps: this.props,
        parent: this.context["form"],
        notifyChange: this.notifyChange
      }
    };
  }

  static childContextTypes = {
    form: PropTypes.object
  };

  static Bind = new FormBinder();

  static jsonDataBinder<T>(data: T): IDataBinder<T> {
    return new JsonEntityBinder(data);
  }

  static jsonDataBinderWithClone<T>(data: T): IDataBinder<T> {
    return new JsonEntityBinder(FormDataClone.custom(data));
  }

  private preventDefault = e => {
    e.preventDefault();
    return false;
  };

  private setRef = (r: HTMLElement) => (this.formDom = r)
  render() {
    const ch = FormElementProcessor.processChildren(this.props, this.props.children, this.notifyChange);
    const hasParentForm = !!Form.getFormContext(this.context);
    const className = ClassHelpers.classNames("form", hasParentForm && "form-nested", this.props.className);
    return hasParentForm ?
      React.createFactory("div")({ className: className, ref: this.setRef }, ch) :
      React.createFactory("form")({ className: className, onSubmit: this.preventDefault, ref: this.setRef }, ch);
  }

  private notifyChange = () => {
    this.props.onDataBinderChange && this.props.onDataBinderChange(this.props.dataBinder);
    this.props.onDataChanged && this.props.onDataChanged(this.props.dataBinder.toJson());
  };
}

class FormElementProcessor {
  static processChildren(formProps: IFormCoreProps, node: React.ReactNode, notifyChange: () => void) {
    const validationResults = formProps.validationResults;
    return React.Children.map(node, (element) => {
      if (!React.isValidElement<React.HTMLProps<HTMLElement>>(element) || !element.props) {
        return element
      }

      let props: React.DOMAttributes<HTMLElement> = _.extend({}, element.props);

      // TODO: Was this needed - its set below if a form binder exists!
      // if (formProps.validationMode && props["validationMode"]) {
      //   props["validationMode"] = formProps.validationMode;
      // }

      let children = element.props.children;

      const injector = props as IFormBinderInjector<any>;
      const formBinder = getFormBinderFromInjector(injector);
      if (formBinder) {
        updateFormBinderInjector(injector, null);
        if (validationResults && validationResults.length) {
          const vr: IFormValidationResult = _.find(validationResults, vr => vr.attribute === formBinder.dataPath);
          if (vr) {
            DataValidationMessage.set(props, vr.message);
          } else {
            // use for child form
            const childValidators = extractChildValidationResults(validationResults, formBinder.dataPath);
            if (childValidators && childValidators.length) {
              props["validationResults"] = childValidators;
            }
          }

          if (formProps.validationMode && props["validationMode"]) {
            props["validationMode"] = formProps.validationMode;
          }
        }

        formBinder.setElementProperty(props, formProps.dataBinder, validationResults);
        formBinder.handleValueChanged(props, formProps.dataBinder, notifyChange);
        if (formBinder.extender) {
          formBinder.extender(props, formProps.dataBinder, notifyChange);
        }
        if (formBinder.overrideChildren){
          const newChildren = formBinder.overrideChildren(props, formProps.dataBinder)
          if (typeof newChildren !== undefined){
            children = FormElementProcessor.processChildren(formProps, newChildren, notifyChange);
          }
        }
      } else if (children) {
        children = FormElementProcessor.processChildren(formProps, children, notifyChange);
      }

      return React.cloneElement<any, any>(element, props, children);
    });
  }
}