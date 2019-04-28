import { storiesOf } from "../story-host";
import { Form, useForm, TextInput, UseFormContext, createFormContext, IUseFormProps } from '../_symlink';
import * as React from 'react'

storiesOf("Form", Form)
  .add("useForm", () => {
    const data = React.useMemo(() => ({ firstName: "keith", lastName: "walker", address: { line1: "home" }, jobs: [{ org: "Rocketmakers", address: { line1: "here" } }, { org: "BBC", address: { line1: "there" } }] }), [])
    return <PersonUseForm data={data} />
  })
  .add("createFormContext", () => {
    return <PersonForm />
  })

// function useDidUpdateEffect(fn: React.EffectCallback, deps?: React.DependencyList) {
//   const didMountRef = React.useRef(false);

//   React.useEffect(() => {
//     if (didMountRef.current) {
//       fn();
//     }
//     else {
//       didMountRef.current = true;
//     }
//   }, deps);
// }

function PersonUseForm(props: { data: IPersonData }) {
  const { DataForm, bind, dataBinder: binder, context } = useForm(props.data)

  const ab = bind.createChildBinder(b => b.prop("address"))
  const jb = bind.createChildBinder("jobs")

  // useDidUpdateEffect(() => console.log("HEY"), [binder.getKeyValue("firstName")])

  return (
    <DataForm>
      <div>
        <TextInput {...bind.text("firstName")} />
      </div>
      <TextInput {...bind.text("lastName")} />
      <TextInput {...bind.text(b => b.prop("jobs").index(0).prop("address").prop("line1"))} />
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

function PersonFormFields(props: IUseFormProps<IPersonData>) {
  const { bind, dataBinder: binder } = props
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


function PersonSubFormFields(props: IUseFormProps<IPersonData>) {
  const { bind } = props
  return (
    <>
      <TextInput placeholder="lastName" {...bind.text("lastName")} />
    </>
  )
}