// IMPORTS
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as moment from 'moment';
import * as _ from 'underscore';
import { Link } from "react-router";
import { Grid, Row, Col } from './../../../source/components/layout/grid';
import { Button } from './../../../source/components/interaction/button';
import { Image } from './../../../source/components/display/image';
import { CalendarInput } from './../../../source/components/form/inputs/calendarInput';
import { Dialog } from './../../../source/components/display/dialog';
import { BurgerMenu } from './../../../source/components/navigation/burgerMenu';
import { CheckboxInput } from './../../../source/components/form/inputs/checkboxInput';
import { RadioInput } from './../../../source/components/form/inputs/radioInput';
import { TextInput } from './../../../source/components/form/inputs/textInput';
import { SelectInput } from './../../../source/components/form/inputs/selectInput';
import { ColorSwatch } from './../components/colorSwatch';
import { AutoCompleteInput } from './../../../source/components/form/inputs/autoCompleteInput';
import { DateInput, DateInputFormBinder } from './../../../source/components/form/inputs/dateInput';
import { TimeInput, TimeInputFormBinder } from './../../../source/components/form/inputs/TimeInput';
import { Form } from './../../../source/components/form/form';
import apiClient from './../api/apiClient.ts';

export class Home extends React.Component<{}, { dialogOpen: boolean }> {
  /**
   *
   */
  constructor() {
    super();
    this.state = { dialogOpen: false }
  }
  private button: Button;
  doSomething() {
    var b = this.button;
  }
  public render() {
    return (
        <Grid debugMode={false} fillContainer={false}>
          <Row>
            <Col><TextInput placeholder="rustle my jimmies"/></Col>
            <Col><Button disabled={true} className="shadow bg-positive" onClick={() => this.setState({ dialogOpen: true }) } ref={b => this.button = b}>Hello world!</Button></Col>
          </Row>
          <Row>
            <Col>
              <AutoCompleteInput disabled={false} placeholder="Search for an artist and something else to make this box way to long and it will break..."
                multiSelect={false}
                onSelected={(item) => console.log}
                canClear={true}
                remoteQuery={(input) => apiClient.searchForArtist(input).then((r) => _.map(r.json.artists.items, (r: any) => { return { id: r.id, name: r.name, data: r } })) }/></Col>
            <Col><TextInput value="Some text" disabled={true}/></Col>
          </Row>
          <Row>
            <Col>
              <AutoCompleteInput disabled={false} placeholder="Search for some artists..."
                multiSelect={true}
                onSelected={(item) => console.log}
                canClear={true}
                remoteQuery={(input) => apiClient.searchForArtist(input).then((r) => _.map(r.json.artists.items, (r: any) => { return { id: r.id, name: r.name, data: r } })) }/></Col>
            <Col><TextInput value="Some text" disabled={true}/></Col>
          </Row>
          <Row>
            <Col width="2*"><TextInput value="Some text" disabled={true}/></Col>
            <Col><DateInput date="01/02/03" disabled={true}/></Col>
            <Col><TimeInput time="14:30" disabled={true}/></Col>
            <Col><CalendarInput disabled={true}/></Col>
          </Row>
        </Grid>
    );
  }
}
