// IMPORTS
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as moment from 'moment';
import * as _ from 'underscore';
import { Link } from "react-router";
import { Grid, Row, Col, SingleColumnRow } from './../../../source/components/layout/grid';
import { Button } from './../../../source/components/interaction/button';
import { Image } from './../../../source/components/display/image';
import { DatePickerInput } from './../../../source/components/form/inputs/datePickerInput';
import { Dialog } from './../../../source/components/display/dialog';
import { BurgerMenu } from './../../../source/components/navigation/burgerMenu';
import { CheckboxInput } from './../../../source/components/form/inputs/checkboxInput';
import { RadioInput } from './../../../source/components/form/inputs/radioInput';
import { TextInput } from './../../../source/components/form/inputs/textInput';
import { SelectInput } from './../../../source/components/form/inputs/selectInput';
import { ColorSwatch } from './../components/colorSwatch';
import { DropdownSelect } from './../../../source/components/form/dropdownSelect';
import { TimeSelector } from './../../../source/components/form/inputs/timeSelectorInput';
import { DateInput, DateInputFormBinder } from './../../../source/components/form/inputs/dateInput';
import { Form } from './../../../source/components/form/form';
import apiClient from './../api/apiClient.ts';

export class Home extends React.Component<{}, {}> {

  public render() {
    return (
      <div className="p-small">
      <Grid>
        <Row>
          <Col>1</Col>
          <Col>2</Col>
        </Row>
      </Grid>
      </div>
    );
  }
}
