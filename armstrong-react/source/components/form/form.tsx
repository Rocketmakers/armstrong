import * as React from "react";
import * as _ from "underscore";
import { ClassHelpers } from "../../utilities/classHelpers";
import { FormBinder } from "./formBinders";
import { DataValidationMessage, getFormBinderFromInjector, IChildDataBinder, IDataBinder, IFormBinderInjector, IFormValidationResult, updateFormBinderInjector } from "./formCore";
import { IArrayProp, IObjectProp, PropType, toDataPath } from "./propertyPathBuilder";
import { PropertyPathResolver } from "./propertyPathResolver";

/** The default Json Data Binder - NOTE, the original instance provided is MUTABLE */
class JsonDataBinder<T> implements IDataBinder<T> {
  constructor(private data: T) {
    this.getKeyValue = this.getKeyValue.bind(this)
    this.setKeyValue = this.setKeyValue.bind(this)
    this.createChildBinder = this.createChildBinder.bind(this)
  }
  lastDataPathSet?: string;

  getKeyValue<X>(dataName: (builder: PropType<T>) => IObjectProp<X>): X
  getKeyValue<X>(dataName: (builder: PropType<T>) => IArrayProp<X>): X[]
  getKeyValue<TKey extends keyof T>(keyName: TKey): T[TKey];
  getKeyValue(keyName: any): any {
    if (_.isString(keyName)) {
      return this.data[keyName];
    }

    return PropertyPathResolver.getValue(this.data, toDataPath(keyName))
  };

  setKeyValue<X>(dataName: (builder: PropType<T>) => IObjectProp<X>, value: X): void
  setKeyValue<X>(dataName: (builder: PropType<T>) => IArrayProp<X>, value: X[]): void
  setKeyValue<TKey extends keyof T>(keyName: TKey, value: T[TKey]): void;
  setKeyValue(keyName: any, value: any): void {
    if (_.isString(keyName)) {
      this.data[keyName] = value;
      this.lastDataPathSet = keyName;
      return
    }
    const dataPath = toDataPath(keyName)
    PropertyPathResolver.setValue(this.data, dataPath, value)
    this.lastDataPathSet = dataPath;
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

  createChildBinder<X>(dataName: (builder: PropType<T>) => IObjectProp<X>): IChildDataBinder<X>
  createChildBinder<X>(dataName: (builder: PropType<T>) => IArrayProp<X>): IChildDataBinder<X[]>
  createChildBinder<TKey extends keyof T>(keyName: TKey): IChildDataBinder<T[TKey]>
  createChildBinder(keyName: any): IChildDataBinder<any> {
    return new JsonChildDataBinder(keyName, this)
  }
}

class JsonChildDataBinder<T> extends JsonDataBinder<T> implements IChildDataBinder<T> {
  constructor(private parentKey: any, private parentDataBinder: IDataBinder<any>) {
    super(FormDataClone.custom(parentDataBinder.getKeyValue(parentKey)))
  }

  sync = () => {
    this.parentDataBinder.setKeyValue(this.parentKey, FormDataClone.custom(this.toJson()))
  }
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

// tslint:disable-next-line:interface-name
export interface ValidationProps {
  /** (string) How to display validation messages */
  validationMode?: ValidationModes;
}

export type IFormInputProps<T> = React.Props<T> & ValidationProps;

export type IFormInputHTMLProps<E = React.HTMLAttributes<HTMLElement>> = E & ValidationProps;

export interface IFormCoreProps {
  /** The forms data binder instance, this contains the data that is used by bound form elements */
  dataBinder: IDataBinder<any>;

  /** An optional array of validation results - bound controls whose dataBinder dataPath matches an attribute will be annotated with a 'data-validation-message' property */
  validationResults?: IFormValidationResult[];

  /** (string) How to display validation messages. 'icon' (default) shows a small exclamation symbol in the right of the field, 'below' shows the message below the field, while 'both' is a combination, and none hides all validation UI */
  validationMode?: ValidationModes
}

export interface IFormProps extends React.FormHTMLAttributes<typeof Form>, IFormCoreProps {
  /** Called when bound form data changes: NOTE, this is called on every key stroke/interaction on any of the bound fields */
  onDataChanged?: (data?: any) => void;

  /** Called when bound form data changes: NOTE, this is called on every key stroke/interaction on any of the bound fields */
  onDataBinderChange?: (dataBinder: IDataBinder<any>) => void;

  /** (boolean) Automatically focus the first input (if it's empty) when the form is rendered */
  focusFirstEmptyInput?: boolean;

  /** (() => void) Allows custom submit handling */
  onSubmit?: () => void;
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
  const vrs = validationResults && _.filter(validationResults, vr => vr.attribute.indexOf(dataPath + ".") === 0);
  if (!vrs) {
    return;
  }

  return vrs.map(a => ({ ...a, attribute: a.attribute.substring(dataPath.length + 1) }));
}

export const FormContext = React.createContext<IFormContext>(undefined);

/**
 * A stateless data bindable form - state is held within the 'dataBinder' property
 * NOTE: This is designed to render all elements in the form on every change. This allows other participating elements to react to these changes
 * NOTE: This element provides a react context, this can be used to get access to the Forms dataBinder (or any parent Form dataBinder when nested)
 */
export function Form(props: IFormProps) {
  const { focusFirstEmptyInput, onSubmit, onDataBinderChange, onDataChanged, dataBinder, children, className, validationMode } = props
  const formDom = React.useRef<HTMLElement>()
  React.useEffect(() => {
    if (focusFirstEmptyInput) {
      const inputs = formDom.current.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input[type=text]:not(:disabled), textarea:not(:disabled)");
      if (inputs[0] && !inputs[0].value) {
        inputs[0].focus();
      }
    }
  })

  const preventDefault = React.useCallback(e => {
    if (onSubmit) {
      onSubmit();
    }
    e.preventDefault();
    return false;
  }, [onSubmit]);

  const notifyChange = React.useCallback(() => {
    if (onDataBinderChange) { onDataBinderChange(dataBinder); }
    if (onDataChanged) { onDataChanged(dataBinder.toJson()); }
  }, [onDataBinderChange, onDataChanged, dataBinder]);

  const ch = FormElementProcessor.processChildren({ ...props, validationMode: validationMode || "icon" }, children, notifyChange);
  const context = React.useContext(FormContext)
  const hasParentForm = !!context

  const className1 = ClassHelpers.classNames("form", hasParentForm && "form-nested", className);
  return <FormContext.Provider value={{
    dataBinder,
    coreProps: props,
    parent: context,
    notifyChange,
  }}> {hasParentForm ?
    React.createFactory("div")({ className: className1, ref: formDom }, ch) :
    React.createFactory("form")({ className: className1, onSubmit: preventDefault, ref: formDom }, ch)
    }
  </FormContext.Provider>
}

Form.Bind = new FormBinder<any>();

Form.jsonDataBinder = function <T>(data: T): IDataBinder<T> { return new JsonDataBinder(data) }

Form.jsonDataBinderWithClone = function <T>(data: T): IDataBinder<T> { return new JsonDataBinder(FormDataClone.custom(data)) }

export function ParentFormContext(props: { children: React.ReactNode }) {
  const { children } = props

  const context = React.useContext(FormContext)
  if (!context) {
    // tslint:disable-next-line:no-console
    console.error("A ParentFormBinder should be rendered within the context of a parent Form")
  }

  return context ? FormElementProcessor.processChildren(context.coreProps, children, context.notifyChange) : children;

  // return (
  //   <FormContext.Consumer>
  //     {context => {
  //       if (!context) {
  //         // tslint:disable-next-line:no-console
  //         console.error("A ParentFormBinder should be rendered within the context of a parent Form")
  //       }

  //       return context ? FormElementProcessor.processChildren(context.coreProps, children, context.notifyChange) : children;
  //     }}
  //   </FormContext.Consumer>
  // )
}

class FormElementProcessor {
  static processChildren(formProps: IFormCoreProps, node: React.ReactNode, notifyChange: () => void) {
    const validationResults = formProps.validationResults;
    return React.Children.map(node, element => {
      if (!React.isValidElement<React.HTMLAttributes<HTMLElement>>(element) || !element.props) {
        return element
      }

      const props: React.DOMAttributes<HTMLElement> = _.extend({}, element.props);

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
          const vrs: IFormValidationResult = _.find(validationResults, vr => vr.attribute === formBinder.dataPath);
          if (vrs) {
            DataValidationMessage.set(props, vrs.message);
          } else {
            // use for child form
            const childValidators = extractChildValidationResults(validationResults, formBinder.dataPath);
            if (childValidators && childValidators.length) {
              // tslint:disable-next-line:no-string-literal
              props["validationResults"] = childValidators;
            }
          }

          // tslint:disable-next-line:no-string-literal
          if (formProps.validationMode && props["validationMode"]) {
            // tslint:disable-next-line:no-string-literal
            props["validationMode"] = formProps.validationMode;
          }
        }

        formBinder.setElementProperty(props, formProps.dataBinder, validationResults);
        formBinder.handleValueChanged(props, formProps.dataBinder, notifyChange);
        if (formBinder.extender) {
          formBinder.extender(props, formProps.dataBinder, notifyChange);
        }
        if (formBinder.overrideChildren) {
          const newChildren = formBinder.overrideChildren(props, formProps.dataBinder)
          if (typeof newChildren !== undefined) {
            children = FormElementProcessor.processChildren(formProps, newChildren, notifyChange);
          }
        }
      } else if (children) {
        children = FormElementProcessor.processChildren(formProps, children, notifyChange);
      }

      return React.cloneElement(element, props, children);
    });
  }
}