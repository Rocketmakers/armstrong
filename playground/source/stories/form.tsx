import { storiesOf } from "../story-host";
import { Form, useForm, TextInput, UseFormContext, createFormContext } from '../_symlink';
import * as React from 'react'
import { IUseFormBase, ParentFormContext } from '../_symlink/components/form/form';

storiesOf("Form", Form)
  .add("useForm", () => {
    return <PersonUseForm data={{ firstName: "keith", lastName: "walker", address: { line1: "home" }, jobs: [{ org: "Rocketmakers", address: { line1: "here" } }, { org: "BBC", address: { line1: "there" } }] }} />
  })
  .add("createFormContext", () => {
    return <PersonForm />
  })

function PersonUseForm(props: { data: IPersonData }) {
  const { DataForm, bind, binder, context } = useForm(props.data)
  binder.getValue("a.b.c.0.d")
  binder.setValue("a.b.c.0.d", "ddd")

  binder.getKeyValue("firstName")
  binder.setKeyValue("firstName", "name")

  const ab = bind.createChildBinder("address")
  const jb = bind.createChildBinder("jobs")

  return (
    <DataForm>
      <div>
        <TextInput {...bind.text("firstName")} />
      </div>
      <TextInput {...bind.text("lastName")} />
      <TextInput {...bind.text(b => b.prop("jobs").index(0).prop("address"))} />
      <TextInput {...bind.text(b => b.prop("address").prop("line1"))} />
      <TextInput {...ab.text("line1")} />
      {binder.getKeyValue("jobs").map((job, i) => <TextInput {...jb.text(b => b.index(i).prop("org"))} />)}
      <PersonUseSubForm context={context} />
      {JSON.stringify(binder.toJson(), null, 1)}
    </DataForm>
  )
}

function PersonUseSubForm(props: { context: UseFormContext<IPersonData> }) {
  const { DataForm, bind } = props.context.useForm()

  return (
    <DataForm>
      <h1>Sub Form</h1>
      <TextInput {...bind.text("firstName")} />
      <PersonUseSubSubForm context={props.context} />
    </DataForm>
  )
}

function PersonUseSubSubForm(props: { context: UseFormContext<IPersonData> }) {
  const { DataForm, bind } = props.context.useForm(b => b.prop("jobs").index(0).prop("address"))

  return (
    <DataForm>
      <h1>Sub Form</h1>
      <TextInput {...bind.text("line1")} />
    </DataForm>
  )
}


const PersonFormContext = createFormContext<IPersonData>()

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
      <PersonFormContext.Form initialData={data}>
        {PersonFormFields}
      </PersonFormContext.Form>
      <PersonSubForm />
    </>
  )
}

function PersonFormFields(props: IUseFormBase<IPersonData>) {
  const { bind, binder } = props
  return (
    <>
      <TextInput placeholder="firstName" {...bind.text("firstName")} />
      <PersonSubForm />
      <div>{JSON.stringify(binder.toJson(), null, 1)}</div>
    </>
  )
}

function PersonSubForm() {
  return (
    <PersonFormContext.ChildForm>
      {PersonSubFormFields}
    </PersonFormContext.ChildForm>
  )
}


function PersonSubFormFields(props: IUseFormBase<IPersonData>) {
  const { bind } = props
  return (
    <>
      <TextInput placeholder="lastName" {...bind.text("lastName")} />
    </>
  )
}