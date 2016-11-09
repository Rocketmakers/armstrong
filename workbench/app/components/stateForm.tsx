import * as React from "react";
import { TextInput } from './../../../source/components/simpleForm/inputs/textInput';
import { CheckboxInput } from './../../../source/components/simpleForm/inputs/checkboxInput';
import { ToggleInput } from './../../../source/components/simpleForm/inputs/toggleInput';
import { RadioInput } from './../../../source/components/simpleForm/inputs/radioInput';
import { CalendarInput } from './../../../source/components/simpleForm/inputs/calendarInput';
import { TimeInput } from './../../../source/components/simpleForm/inputs/timeInput';
import { DateInput } from './../../../source/components/simpleForm/inputs/dateInput';
import { SelectInput, ISelectInputOption } from './../../../source/components/simpleForm/inputs/selectInput';
import { AutoCompleteInput, IAutoCompleteOption } from './../../../source/components/simpleForm/inputs/autoCompleteInput';
import { Form } from "./../../../source/components/simpleForm/form"
import { Grid, Row, Col } from "./../../../source/components/layout/grid"

import "./stateForm.scss";

interface IData {
  firstName: string;
  lastName: string;
  type: number;
  date: string;
  date2: string;
  time: string;
  age: number;
  children: number;
  requireAge: boolean;
  enabled: boolean;
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
  private options: any[] = [{ id: 1, name: 'test' }, { id: 2, name: 'test 2' }];
  constructor() {
    super();
    this.state = { data: { firstName: "", date: "2016-11-03", date2: "2016-11-03", time: "00:30", lastName: "Walker", enabled: false, tags: [this.options[0]], type: null, requireAge: false, age: null, children: 1, address: { firstLine: "" } } };
  }
  componentWillMount() {
    if (this.props.data) {
      this.setState({ data: this.props.data })
    }
  }

  render() {
    return (
      <Form entity={this.state.data} className="state-form">
        <Grid className="form-grid">
          <Row>
            <Col>
              <label>First name</label>
              <TextInput type="text" prop="firstName" />
            </Col>
            <Col>
              <label>Last name</label>
              <TextInput placeholder="Enter your name..." type="text" prop="lastName" />
            </Col>
          </Row>
          <Row>
            <Col>
              <label>Type</label>
              <SelectInput prop="type" options={this.options} placeholder="select an option..." />
            </Col>
          </Row>
          <Row>
            <Col>
              <label>Date</label>
              <CalendarInput prop="date" />
            </Col>
            <Col>
              <label>Another Date</label>
              <DateInput prop="date2" />
            </Col>
            <Col>
              <label>Time</label>
              <TimeInput prop="time" />
            </Col>
          </Row>
          <Row>
            <Col>
              <ToggleInput prop="enabled" className="m-top-small" label="Enabled?" />
            </Col>
            <Col>
              <CheckboxInput prop="requireAge" label="Require age?" className="m-top-small" />
            </Col>
          </Row>
          <Row>
            <Col>
              <label>Age</label>
              <TextInput type="number" prop="age" disabled={!this.state.data.requireAge} />
            </Col>
          </Row>
          <Row>
            <Col>
              <label>Tags</label>
              <AutoCompleteInput multiSelect={true} prop="tags" options={this.options} />
            </Col>
            <Col>
              <label>Children</label>
              <div>
                <RadioInput prop="children" label="1 kid" value={1} />
                <RadioInput prop="children" label="2 kids" value={2} />
                <RadioInput prop="children" label="3 kids" value={3} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <label>Address Line 1</label>
              <TextInput type="text" prop="address.firstLine" />
            </Col>
          </Row>
          <Row>
            <Col>
              <button onClick={(e) => { e.preventDefault(); this.props.onSave(this.state.data) } }>Save</button>
            </Col>
          </Row>
        </Grid>
      </Form>
    )
  }
}