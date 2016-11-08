import * as React from "react";
import { TextInput } from './../../../source/components/stateForm/inputs/textInput';
import { CheckboxInput } from './../../../source/components/stateForm/inputs/checkboxInput';
import { RadioInput } from './../../../source/components/stateForm/inputs/radioInput';
import { CalendarInput } from './../../../source/components/stateForm/inputs/calendarInput';
import { SelectInput, ISelectInputOption } from './../../../source/components/stateForm/inputs/selectInput';
import { AutoCompleteInput, IAutoCompleteOption } from './../../../source/components/stateForm/inputs/autoCompleteInput';
import { Form } from "./../../../source/components/stateForm/form"

import "./stateForm.scss";

interface IData {
  firstName: string;
  lastName: string;
  type: number;
  date: string;
  age: number;
  children: number;
  requireAge: boolean;
  tags: string[];
  address: {
    firstLine: string;
  }
}


interface IStateFormState {
  data?: IData;
}

interface IStateFormProps extends React.Props<StateForm> {
  data?: IData;
  onSave: (data: IData) => void;
}

export class StateForm extends React.Component<IStateFormProps, IStateFormState> {
  private options: any[] = [{ id: 1, name: 'test'}, { id: 2, name: 'test 2'}];
  constructor() {
    super();
    this.state = { data: { firstName: "", date: "2016-11-03", lastName: "Walker", tags: [], type: 2, requireAge: true, age: null, children: 1, address: { firstLine: "" } } };
  }
  componentWillMount() {
    if (this.props.data) {
      this.setState({ data: this.props.data })
    }
  }

  render() {
    let d = this.state.data;
    return (
      <Form entity={d} className="state-form">
        <label>First name</label>
        <TextInput type="text" prop="firstName" />
        <label>Last name</label>
        <TextInput type="text" prop="lastName" multiLine={true} />
        <label>Type</label>
        <SelectInput prop="type" options={this.options} />
        <label>Date</label>
        <CalendarInput prop="date" />
        <CheckboxInput prop="requireAge" label="Require age?" className="m-top-small" />
        <label>Age</label>
        <TextInput type="number" prop="age" disabled={!d.requireAge} />
        <label>Tags</label>
        <AutoCompleteInput multiSelect={true} prop="tags" options={this.options} />
        <label>Children</label>
        <RadioInput prop="children" label="1 kid" value={1}/>
        <RadioInput prop="children" label="2 kids" value={2}/>
        <RadioInput prop="children" label="3 kids" value={3}/>
        <label>Address Line 1</label>
        <TextInput type="text" prop="address.firstLine" />
        <button onClick={(e) => { e.preventDefault(); this.props.onSave(d) } }>Save</button>
      </Form>
    )
  }
}