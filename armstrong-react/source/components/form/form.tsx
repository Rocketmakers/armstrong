import * as React from "react";
import * as _ from "underscore";
import { ClassHelpers } from "../../utilities/classHelpers";
import { FormBinder } from "./formBinders";
import { DataValidationMessage, getFormBinderFromInjector, IDataBinder, IFormBinderInjector, IFormValidationResult, updateFormBinderInjector } from "./formCore";
import { FormBinderKey, IArrayProp, IObjectProp, PropertyPathFor, PropType, toDataPath } from "./propertyPathBuilder";
import { PropertyPathResolver } from "./propertyPathResolver";

/** The default Json Entity binder - NOTE, the original instance provided is MUTABLE */
class JsonDataBinder<T> implements IDataBinder<T> {
  constructor(private data: T) { }
  lastDataPathSet?: string;

  getKeyValue<X>(dataName: (builder: PropType<T>) => IObjectProp<X>): X
  getKeyValue<X>(dataName: (builder: PropType<T>) => IArrayProp<X>): X[]
  getKeyValue<TKey extends keyof T>(keyName: TKey): T[TKey];
  getKeyValue(keyName: any): any {
    return this.data[toDataPath(keyName)];
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

export interface IUseParentForm<T> {
  bind: FormBinder<T>
  DataForm: React.FunctionComponent<{}>
}

export function useParentForm<TDataBinder, X>(context: UseFormContext<TDataBinder>, dataName: (builder: PropType<TDataBinder>) => IObjectProp<X>): IUseParentForm<X>
export function useParentForm<TDataBinder, X>(context: UseFormContext<TDataBinder>, dataName: (builder: PropType<TDataBinder>) => IArrayProp<X>): IUseParentForm<X[]>
export function useParentForm<TDataBinder, TKey extends Extract<keyof TDataBinder, string>>(context: UseFormContext<TDataBinder>, dataName: TKey): IUseParentForm<TDataBinder[TKey]>
export function useParentForm<TDataBinder>(context: UseFormContext<TDataBinder>, parentPath?: FormBinderKey<TDataBinder>): IUseParentForm<any> {
  return { DataForm: ParentFormContext, bind: new FormBinder<TDataBinder>(toDataPath(parentPath)) }
}

export function ParentFormContext(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <FormContext.Consumer>
      {context => {
        if (!context) {
          // tslint:disable-next-line:no-console
          console.error("A ParentFormBinder should be rendered within the context of a parent Form")
        }

        return context ? FormElementProcessor.processChildren(context.coreProps, children, context.notifyChange) : children;
      }}
    </FormContext.Consumer>
  )
}

interface IFC<TDataBinder> {
  <X>(builder: PropType<TDataBinder>): IObjectProp<X>
  <X>(builder: PropType<TDataBinder>): IArrayProp<X>
  dataName: Extract<keyof TDataBinder, string>
}

export function createFormContext<TDataBinder>() {
  return {
    Form: (props: { initialData: TDataBinder, dontCloneData?: boolean, children: (value: IUseFormBase<TDataBinder>) => React.ReactNode }) => {
      const { initialData, dontCloneData, children } = props
      const { DataForm, ...rest } = useForm(initialData, dontCloneData)
      return (
        <DataForm>
          {children(rest)}
        </DataForm>
      )
    },
    ChildForm: (props: { children: (value: IUseFormBase<TDataBinder>) => React.ReactNode }) => {
      const ctx = React.useContext(FormContext)
      if (!ctx) {
        return null
      }
      return (
        <ParentFormContext>
          {props.children({ bind: new FormBinder<TDataBinder>(), binder: ctx && ctx.dataBinder })}
        </ParentFormContext>
      )
    },
  }
}

type IHookFormProps = Pick<IFormProps, Exclude<keyof IFormProps, "dataBinder" | "onDataBinderChange">>

export interface IUseFormBase<T> {
  binder: IDataBinder<T>
  bind: FormBinder<T>
}

export interface IUseForm<T> extends IUseFormBase<T> {
  DataForm: React.FunctionComponent<IHookFormProps>
  context: UseFormContext<T>
}

export class UseFormContext<TDataBinder> {
  useForm<X>(dataName: (builder: PropType<TDataBinder>) => IObjectProp<X>): IUseParentForm<X>
  useForm<X>(dataName: (builder: PropType<TDataBinder>) => IArrayProp<X>): IUseParentForm<X[]>
  useForm<TKey extends Extract<keyof TDataBinder, string>>(dataName: TKey): IUseParentForm<TDataBinder[TKey]>
  useForm(): IUseParentForm<TDataBinder>
  useForm(dataPath?: FormBinderKey<TDataBinder>): IUseParentForm<any> {
    return { DataForm: ParentFormContext, bind: new FormBinder<TDataBinder>(toDataPath(dataPath)) }
  }
}

export function useForm<T>(initialData: T, dontCloneData: boolean = false): IUseForm<T> {
  const [__, dispatch] = React.useReducer<React.Reducer<boolean, {}>>(state => !state, false);
  const binder = React.useMemo(() => {
    return dontCloneData ? Form.jsonDataBinder(initialData) : Form.jsonDataBinderWithClone(initialData)
  }, [initialData, dontCloneData])

  const bind = React.useMemo(() => {
    // console.log("bind")
    return new FormBinder<T>()
  }, [])

  const onDataBinderChange = React.useCallback(() => dispatch({}), [dispatch]);

  const DataForm = React.useCallback<React.FunctionComponent<IHookFormProps>>(p => {
    return <Form {...p} dataBinder={binder} onDataBinderChange={onDataBinderChange} />
  }, [binder, onDataBinderChange])

  return { binder, bind, DataForm, context: new UseFormContext<T>() }
}

const FormContext = React.createContext<IFormContext>(undefined);

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
