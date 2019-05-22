import * as React from "react";
import { Form, FormContext, IFormProps, ParentFormContext } from "./form";
import { FormBinder } from "./formBinders";
import { IDataBinder } from "./formCore";
import { FormBinderKey, IArrayProp, IObjectProp, PropType, toDataPath } from "./propertyPathBuilder";

export interface IUseParentForm<T> {
  bind: FormBinder<T>
  DataForm: React.FunctionComponent<{}>
}

export function createFormContext<TDataBinder>() {
  return {
    Form: (props: { initialData: TDataBinder, withoutClone?: boolean, children: (value: IUseFormProps<TDataBinder>) => React.ReactNode }) => {
      const { initialData, withoutClone, children } = props
      const { DataForm, ...rest } = useForm(initialData, withoutClone)
      return (
        <DataForm>
          {children(rest)}
        </DataForm>
      )
    },
    ChildForm: (props: { children: (value: IUseFormProps<TDataBinder>) => React.ReactNode }) => {
      const ctx = React.useContext(FormContext)
      if (!ctx) {
        return null
      }
      return (
        <ParentFormContext>
          {props.children({ bind: new FormBinder<TDataBinder>(), dataBinder: ctx && ctx.dataBinder, notifyChange: ctx.notifyChange })}
        </ParentFormContext>
      )
    },
  }
}

type IHookFormProps<T> = Pick<IFormProps, Exclude<keyof IFormProps, "dataBinder" | "onDataBinderChange" | "onDataChanged">> & { onDataChanged?: (data?: T) => void }

export interface IUseFormProps<T> {
  dataBinder: IDataBinder<T>
  bind: FormBinder<T>
  notifyChange: () => void
}

export interface IUseForm<T> extends IUseFormProps<T> {
  DataForm: React.FunctionComponent<IHookFormProps<T>>
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

export function useForm<T>(initialData: T, withoutClone: boolean = false): IUseForm<T> {
  const [__, dispatch] = React.useReducer<React.Reducer<boolean, any>>(state => !state, false);
  const dataBinder = React.useMemo(() => {
    return withoutClone ? Form.jsonDataBinder(initialData) : Form.jsonDataBinderWithClone(initialData)
  }, [initialData, withoutClone])

  const bind = React.useMemo(() => {
    return new FormBinder<T>()
  }, [])

  const context = React.useMemo(() => {
    return new UseFormContext<T>()
  }, [])

  const onDataBinderChange = React.useCallback(() => dispatch(0), [dispatch]);

  const DataForm = React.useCallback<React.FunctionComponent<IHookFormProps<T>>>(p => {
    return <Form {...p} dataBinder={dataBinder} onDataBinderChange={onDataBinderChange} />
  }, [dataBinder, onDataBinderChange])

  return { dataBinder, bind, DataForm, context, notifyChange: onDataBinderChange }
}
