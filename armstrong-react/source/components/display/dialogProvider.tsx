import * as React from "react";
import { utils } from "../../utilities/utils";
import { Dialog, IDialogLayerPropsCore } from "./dialog";

const DialogProviderContext = React.createContext<IDialogStackRef>(undefined)

export const DialogProvider: React.FC<{}> = p => {
  const ref = React.useRef<IDialogStackRef>()
  return (
    <DialogProviderContext.Provider value={{ useDialogPromise: (component, argument, settings) => ref.current && ref.current.useDialogPromise(component, argument, settings) }}>
      {p.children}
      <DialogStack ref={ref} />
    </DialogProviderContext.Provider>
  )
}

export function useDialogProvider<TResult, TArg = void>(component: React.FC<IDialogProviderProps<TResult, TArg>>, settings?: IDialogSettings) {
  const ctx = React.useContext(DialogProviderContext)
  if (!ctx) {
    // tslint:disable-next-line: no-console
    console.log("You are trying to use DialogProvider Context, but no DialogProvider was found in the component hierarchy");
  }
  return React.useCallback((argument?: TArg) => ctx.useDialogPromise(component, argument, settings), [component, settings])
}

export function useConfirmDialogProvider(component: React.FC<IDialogProviderProps<boolean>>, settings?: IDialogSettings) {
  return useDialogProvider(component, settings)
}

interface IDialogSettings extends IDialogLayerPropsCore {
  allowCloseOnBackgroundClick?: boolean
}

interface IDialogContent extends IDialogSettings {
  body: React.ReactNode
  close: () => void
}

export interface IDialogProviderProps<T, TArg = void> {
  close(): void
  choose(data: T): void
  argument?: TArg
}

interface IDialogStackRef {
  useDialogPromise<TResult, TArg>(component: React.FC<IDialogProviderProps<TResult, TArg>>, argument: TArg, settings?: IDialogSettings): Promise<TResult>
}

function DialogStackRef(props: {}, ref: React.Ref<IDialogStackRef>) {
  const [dialogContent, setDialogContent] = React.useState<IDialogContent[]>([])

  const closeDialog = React.useCallback(() => {
    setDialogContent([...utils.array.first(dialogContent, dialogContent.length - 1)])
  }, [dialogContent, setDialogContent])

  React.useImperativeHandle(ref, () => ({
    useDialogPromise<TResult, TArg>(Body: React.FC<IDialogProviderProps<TResult, TArg>>, argument: TArg, settings?: IDialogSettings) {
      return new Promise<TResult>(async resolve => {
        const choose = (d?: TResult) => {
          closeDialog()
          resolve(d)
        }

        const close = () => {
          closeDialog()
          resolve()
        }

        setDialogContent([...dialogContent, { body: <Body argument={argument} close={close} choose={choose} />, close, ...(settings || {}) }])
      })
    },
  }), [dialogContent, closeDialog, setDialogContent])

  return (
    <>
      {dialogContent.map((dc, idx) => (
        <Dialog key={idx} layerClass={dc.layerClass} width={dc.width} height={dc.height} className={dc.className} isOpen={true} onClose={dc.close} title={dc.title} closeOnBackgroundClick={!!dc.allowCloseOnBackgroundClick} headerTagName={dc.headerTagName}>
          {dc.body}
        </Dialog>
      ))}
    </>
  )
}

const DialogStack = React.forwardRef(DialogStackRef)
