import { storiesOf } from "../story-host";
import { Dialog, Button, useForm, TextInput, useDialog, IUseDialogProps, DialogProvider, useDialogProvider, IDialogProviderProps } from '../_symlink';
import * as React from 'react'

const data = { name: "keith" }

storiesOf("Dialog", Dialog)
  .add("Classic Dialog", () => {
    const [open, setOpen] = React.useState(false)
    const { DataForm, bind, dataBinder: binder } = useForm(data)

    return (
      <>
        <Dialog isOpen={open} onClose={() => setOpen(false)}>
          <div>
            <DataForm>
              <TextInput {...bind.text("name")} />
              <div>{JSON.stringify(binder.toJson(), null, 1)}</div>
            </DataForm>
          </div>
        </Dialog>
        <Button onClick={() => setOpen(true)}>Open Classic</Button>
      </>
    )
  })
  .add("Hook Dialog", () => {
    const { open, portal } = useDialog(HookDialog)
    return (
      <>
        <Button onClick={() => open()}>Open Hook</Button>
        {portal}
      </>
    )
  })
  .add("Hook Dialog Initially Open", () => {
    const { open, portal } = useDialog(HookDialog, { initiallyOpen: true })
    return (
      <>
        <Button onClick={() => open()}>Open Hook Open</Button>
        {portal}
      </>
    )
  })
  .add("Hook Dialog With Confirm", () => {
    const { open, portal } = useDialog(HookDialog, { beforeDialogClose: async (reason) => { console.log(reason); return true } })
    return (
      <>
        <Button onClick={() => open()}>Open Hook With Confirm</Button>
        {portal}
      </>
    )
  })
  .add("Dialog Provider Promise", () => {
    return (
      <DialogProvider>
        <PromiseDialog />
      </DialogProvider>
    )
  })


const PromiseDialog: React.FC<{}> = p => {
  const open = useDialogProvider(ConfirmDialog)

  return (
    <>
      <Button onClick={async () => {
        console.log("OK", await open({ name: "keith" }));
      }}>Open Dialog Promise</Button>
    </>
  )
}

const ConfirmDialog: React.FC<IDialogProviderProps<boolean, { name: string }>> = p => {
  return (
    <>
      <h3>{p.argument.name}</h3>
      <Button onClick={() => p.choose(true)}>Ok</Button>
      <Button onClick={p.close}>Cancel</Button>
    </>
  )
}

const HookDialog: React.FC<IUseDialogProps> = p => {
  const { DataForm, bind, dataBinder: binder } = useForm(data)
  return (
    <>
      <DataForm>
        <TextInput {...bind.text("name")} />
        <div>{JSON.stringify(binder.toJson(), null, 1)}</div>
      </DataForm>
      <Button onClick={p.onClose}>Close</Button>
    </>
  )
}