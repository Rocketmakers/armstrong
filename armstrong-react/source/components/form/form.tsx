import * as React from "react";
import { ClassHelpers } from "../../utilities/classHelpers";
import { utils } from "../../utilities/utils";
import { FormBinder } from "./formBinders";
import { DataValidationMessage, DataValidationMode, getFormBinderFromInjector, IChildDataBinder, IDataBinder, IFormBinderInjector, IFormValidationResult, updateFormBinderInjector, ValidationModes } from "./formCore";
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
    if (utils.object.isString(keyName)) {
      return this.data[keyName];
    }

    return PropertyPathResolver.getValue(this.data, toDataPath(keyName))
  };

  setKeyValue<X>(dataName: (builder: PropType<T>) => IObjectProp<X>, value: X): void
  setKeyValue<X>(dataName: (builder: PropType<T>) => IArrayProp<X>, value: X[]): void
  setKeyValue<TKey extends keyof T>(keyName: TKey, value: T[TKey]): void;
  setKeyValue(keyName: any, value: any): void {
    if (utils.object.isString(keyName)) {
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

  createChildBinder<X>(dataName: (builder: PropType<T>) => IObjectProp<X>, autoSync?: boolean): IChildDataBinder<X>
  createChildBinder<X>(dataName: (builder: PropType<T>) => IArrayProp<X>, autoSync?: boolean): IChildDataBinder<X[]>
  createChildBinder<TKey extends keyof T>(keyName: TKey, autoSync?: boolean): IChildDataBinder<T[TKey]>
  createChildBinder(keyName: any, autoSync?: boolean): IChildDataBinder<any> {
    return new JsonChildDataBinder(keyName, this, autoSync)
  }
}

class JsonChildDataBinder<T> extends JsonDataBinder<T> implements IChildDataBinder<T> {
  constructor(private parentKey: any, private parentDataBinder: IDataBinder<any>, private autoSync?: boolean) {
    super(autoSync ? parentDataBinder.getKeyValue(parentKey) : FormDataClone.custom(parentDataBinder.getKeyValue(parentKey)))
  }

  sync = () => {
    if (this.autoSync) {
      return
    }
    this.parentDataBinder.setKeyValue(this.parentKey, FormDataClone.custom(this.toJson()))
  }
}

export class FormDataClone {
  static json<T>(source: T) {
    return JSON.parse(JSON.stringify(source)) as T;
  }

  static custom<T>(source: T) {
    const clone = utils.object.clone(source);
    utils.object.keys(clone).map(key => {
      const value = clone[key];
      if (utils.object.isObject(value)) {
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

export interface IFormCoreProps {
  /** The forms data binder instance, this contains the data that is used by bound form elements */
  dataBinder: IDataBinder<any>;

  /** An optional array of validation results - bound controls whose dataBinder dataPath matches an attribute will be annotated with a 'data-validation-message' and 'data-validation-mode' property */
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
  const vrs = validationResults && utils.array.filter(validationResults, vr => vr.attribute.indexOf(dataPath + ".") === 0);
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

  const className1 = React.useMemo(() => ClassHelpers.classNames("form", hasParentForm && "form-nested", className), [hasParentForm, className]);
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

// tslint:disable-next-line: only-arrow-functions
Form.jsonDataBinder = function <T>(data: T): IDataBinder<T> { return new JsonDataBinder(data) }

// tslint:disable-next-line: only-arrow-functions
Form.jsonDataBinderWithClone = function <T>(data: T): IDataBinder<T> { return new JsonDataBinder(FormDataClone.custom(data)) }

export function ParentFormContext(props: { children: React.ReactNode }) {
  const { children } = props

  const context = React.useContext(FormContext)
  if (!context) {
    // tslint:disable-next-line:no-console
    console.error("A ParentFormBinder should be rendered within the context of a parent Form")
  }

  return context ? FormElementProcessor.processChildren(context.coreProps, children, context.notifyChange) : children;
}

class FormElementProcessor {
  static processChildren(formProps: IFormCoreProps, node: React.ReactNode, notifyChange: () => void) {
    const validationResults = formProps.validationResults;
    return React.Children.map(node, element => {
      if (!React.isValidElement<React.HTMLAttributes<HTMLElement>>(element) || !element.props) {
        return element
      }

      const props: React.DOMAttributes<HTMLElement> = { ...element.props };
      let children = element.props.children;

      const injector = props as IFormBinderInjector<any>;
      const formBinder = getFormBinderFromInjector(injector);
      if (formBinder) {
        updateFormBinderInjector(injector, null);
        if (validationResults && validationResults.length) {
          if (formProps.validationMode && formProps.validationMode !== "none") {
            DataValidationMode.set(props, formProps.validationMode)
          }

          const validationResult: IFormValidationResult = utils.array.find(validationResults, vr => vr.attribute === formBinder.dataPath);
          if (validationResult) {
            DataValidationMessage.set(props, validationResult.message);
          } else {
            // use for child form
            const childValidators = extractChildValidationResults(validationResults, formBinder.dataPath);
            if (childValidators && childValidators.length) {
              // tslint:disable-next-line:no-string-literal
              props["validationResults"] = childValidators;
            }
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
