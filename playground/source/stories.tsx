import { storiesOf } from "./story-host";
import { useDummyImageSrc, useRandomUserImageSrc, Image, Button, IButtonRef, Icon, Form, useForm, TextInput, FormHookContext, CodeInput, useFormContext } from './_symlink';
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
    return <Button onClick={() => alert("click")} leftIcon={Icon.Icomoon.happy} >click</Button>
  })
  .add("Right Icon", () => {
    return <Button onClick={() => alert("click")} rightIcon={Icon.Icomoon.sad} >click</Button>
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
    return <Form1 data={{ firstName: "keith", lastName: "walker", address: { line1: "home" }, jobs: [{ org: "Rocketmakers", address: { line1: "here" } }, { org: "BBC", address: { line1: "there" } }] }} />
  })
  .add("useFormContext", () => {
    return <PersonForm />
  })

function Form1(props: { data: IPersonData }) {
  const { DataForm, bind, binder, context } = useForm(props.data)

  const ab = bind.createChildBinder("address")
  const jb = bind.createChildBinder("jobs")
  // const job1 = bind.createChildBinder(b => b.prop("jobsOfJobs"))
  const jb1 = bind.createChildBinder(b => b.prop("jobs"))
  const jb2 = bind.createChildBinder(b => b.prop("jobs").index(0))
  jb1.text(b => b.index(0).prop("org"))
  jb2.text(b => b.prop("org"))
  return (
    <DataForm>
      <TextInput {...bind.text("firstName")} />
      <TextInput {...bind.text("lastName")} />
      <TextInput {...bind.text(b => b.prop("address").prop("line1"))} />
      <TextInput {...ab.text("line1")} />
      {binder.getKeyValue("jobs").map((job, i) => <TextInput {...jb.text(b => b.index(i).prop("org"))} />)}
      <A context={context} />
      {JSON.stringify(binder.toJson(), null, 1)}
    </DataForm>
  )
}

function A(props: { context: FormHookContext<IPersonData> }) {
  const { DataForm, bind } = props.context.useForm()

  return (
    <DataForm>
      <h1>Formlet</h1>
      <TextInput {...bind.text("firstName")} />
      <B context={props.context} />
    </DataForm>
  )
}

function B(props: { context: FormHookContext<IPersonData> }) {
  const { DataForm, bind } = props.context.useForm(b => b.prop("jobs").index(0).prop("address"))

  return (
    <DataForm>
      <h1>Formlet</h1>
      <TextInput {...bind.text("line1")} />
    </DataForm>
  )
}


const personFormContext = useFormContext<IPersonData>()

interface IAddressData { line1: string }
interface IJobData { org: string, address: IAddressData }
interface IPersonData { firstName: string, lastName: string, address: IAddressData, jobs: IJobData[], jobsOfJobs?: IJobData[][] }

function PersonForm() {

  const data: IPersonData = {
    firstName: "keith",
    lastName: "walker",
    address: {
      line1: "home"
    },
    jobs: [{
      org: "Rocketmakers",
      address: {
        line1: "here"
      }
    }, {
      org: "BBC",
      address: {
        line1: "there"
      }
    }]
  }

  return (
    <>
      <personFormContext.Form initialData={data}>
        {({ bind, binder }) => (
          <>
            <TextInput placeholder="firstName" {...bind.text("firstName")} />
            <PersonSubForm />
            <div>{JSON.stringify(binder.toJson(), null, 1)}</div>
          </>
        )
        }
      </personFormContext.Form>
      <PersonSubForm />
    </>
  )
}

function PersonSubForm() {
  return (
    <personFormContext.ChildForm>
      {({ bind, binder }) => (
        <>
          <TextInput placeholder="lastName" {...bind.text("lastName")} />
          <div>{JSON.stringify(binder.toJson(), null, 1)}</div>
        </>
      )
      }
    </personFormContext.ChildForm>
  )
}