import * as React from "react";
import { Dialog } from './dialog';
import * as _ from "underscore";

const DialogProviderContext = React.createContext<IDialogStackRef>(undefined)

export const DialogProvider: React.FC<{}> = p => {
  const ref = React.useRef<IDialogStackRef>()
  return (
    <DialogProviderContext.Provider value={{ useDialogPromise: (c, s) => ref.current && ref.current.useDialogPromise(c, s) }}>
      {p.children}
      <DialogStack ref={ref} />
    </DialogProviderContext.Provider>
  )
}

export function useDialogProvider<T>(component: React.FC<IDialogProviderProps<T>>, settings?: IDialogSettings) {
  const ctx = React.useContext(DialogProviderContext)
  if (!ctx) {
    console.log("You are trying to use DialogProvider Context, but no DialogProvider was found in the component hierarchy");
  }
  return React.useCallback(() => ctx.useDialogPromise(component, settings), [component, settings])
}

export function useConfirmDialogProvider(component: React.FC<IDialogProviderProps<boolean>>, settings?: IDialogSettings) {
  return useDialogProvider(component, settings)
}

interface IDialogSettings {
  title?: string
  className?: string
  allowCloseOnBackgroundClick?: boolean
}

interface IDialogContent extends IDialogSettings {
  body: React.ReactNode
  close: () => void
}

export interface IDialogProviderProps<T> {
  close(): void
  choose(data: T): void
}

interface IDialogStackRef {
  useDialogPromise<T>(component: React.FC<IDialogProviderProps<T>>, settings?: IDialogSettings): Promise<T>
}

function DialogStackRef(props: {}, ref: React.Ref<IDialogStackRef>) {
  const [dialogContent, setDialogContent] = React.useState<IDialogContent[]>([])

  React.useImperativeHandle(ref, () => ({
    useDialogPromise<T>(Body: React.FC<IDialogProviderProps<T>>, settings?: IDialogSettings) {
      return new Promise<T>(async (resolve) => {
        const choose = (d?: T) => {
          closeDialog()
          resolve(d)
        }

        const close = () => {
          closeDialog()
          resolve()
        }

        setDialogContent([...dialogContent, { body: <Body close={close} choose={choose} />, close, ...(settings || {}) }])
      })
    }
  }))


  const closeDialog = () => {
    setDialogContent([..._.first(dialogContent, dialogContent.length - 1)])
  }

  return (
    <>
      {dialogContent.map((dc, idx) => (
        <Dialog key={idx} className={dc.className} isOpen={true} onClose={dc.close} title={dc.title} closeOnBackgroundClick={!!dc.allowCloseOnBackgroundClick}>
          {dc.body}
        </Dialog>
      ))}
    </>
  )
}

const DialogStack = React.forwardRef(DialogStackRef)