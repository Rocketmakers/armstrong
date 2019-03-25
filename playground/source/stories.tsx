import { storiesOf } from "./story-host";
import { useDummyImageSrc, useRandomUserImageSrc, Image, Button, IButtonRef, Icon, Form, useForm, TextInput, ParentFormContext } from './_symlink';
import * as React from 'react'

storiesOf("Image", Image)
  .props("Dummy Src", () => ({ src: useDummyImageSrc(128, 128) }))
  .props("Rounded Dummy Src", () => ({ src: useDummyImageSrc(128, 128), rounded: true }))
  .add("Random User", () => {
    return <Image src={useRandomUserImageSrc()} />
  })

storiesOf("Button", Button)
  .add("Rounded", () => {
    return <Button onClick={() => alert("click")} rounded>click</Button>
  })
  .add("Left Icon", () => {
    return <Button onClick={() => alert("click")} leftIcon={Icon.Icomoon.addressBook} >click</Button>
  })
  .add("Right Icon", () => {
    return <Button onClick={() => alert("click")} rightIcon={Icon.Icomoon.addressBook} >click</Button>
  })
  .add("Pending", () => {
    return <Button onClick={() => alert("click")} pending={true} >click</Button>
  })
  .add("Focus/Blur", () => {
    const buttonRef = React.useRef<IButtonRef>()
    return (
      <div>
        <div onClick={() => buttonRef.current.focus()}>Focus button</div>
        <div onClick={() => buttonRef.current.blur()}>Blur button</div>
        <Button ref={buttonRef} onClick={() => alert("click")}>click</Button>
      </div>
    )
  })

storiesOf("Form", Form)
  .add("useForm", () => {
    return <Form1 data={{ firstName: "keith", lastName: "walker", address: { line1: "home" }, jobs: [{ org: "Rocketmakers" }, { org: "BBC" }] }} />
  })

interface IForm1 { firstName: string, lastName: string, address: { line1: string }, jobs: { org: string }[] }

function Form1(props: { data: IForm1 }) {
  const { DataForm, bind, binder } = useForm(props.data)

  const ab = bind.createChildBinder("address")
  const jb = bind.createChildBinder("jobs")
  //const jb0 = jb.createChildBinder1(b => b.index(1))
  const jb1 = bind.createChildBinder1(b => b.prop("jobs"))
  const jb2 = bind.createChildBinder1(b => b.prop("jobs").index(0))
  return (
    <DataForm>
      <TextInput {...bind.text("firstName")} />
      <TextInput {...bind.text("lastName")} />
      <TextInput {...bind.text(b => b.prop("address").prop("line1"))} />
      <TextInput {...ab.text("line1")} />
      {binder.getKeyValue("jobs").map((job, i) => <TextInput {...jb.text(b => b.index(i).prop("org"))} />)}
      <A />
      {JSON.stringify(binder.toJson(), null, 1)}
    </DataForm>
  )
}

function A() {
  return (
    <ParentFormContext>
      <TextInput {...Form.Bind.text("firstName")} />

    </ParentFormContext>
  )
}