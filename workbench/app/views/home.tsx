// IMPORTS
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as moment from 'moment';
import { Link } from "react-router";
import { Grid, Row, Col, SingleColumnRow, FixedCentralColumnRow } from './../../../source/components/layout/grid';
import { Heading } from './../../../source/components/text/heading';
import { Button } from './../../../source/components/interaction/button';
import { Text } from './../../../source/components/text/text';
import { Image } from './../../../source/components/display/image';
import { DatePickerInput } from './../../../source/components/form/inputs/datePickerInput';
import { Dialog } from './../../../source/components/display/dialog';
import { BurgerMenu } from './../../../source/components/navigation/burgerMenu';
import { CheckboxInput } from './../../../source/components/form/inputs/checkboxInput';
import { TextInput } from './../../../source/components/form/inputs/textInput';

interface HomeState {
  date?: moment.Moment;
  dialogOpen?: boolean;
}

export class Home extends React.Component<{}, HomeState> {
  constructor() {
    super();
    this.state = { date: moment(), dialogOpen: false }
  }

  public render() {
    return (
      <Grid responsive="none" debugMode={false} className="p-small">
        <Dialog title="I am a dialog!" isOpen={this.state.dialogOpen} onClose={() => this.setState({ dialogOpen: false }) }>
          hello world!
        </Dialog>
        <FixedCentralColumnRow>
          test
        </FixedCentralColumnRow>
        <Row maxCols={3}>
          <Col>
            <div>Hello</div>
          </Col>
          <Col>
            <div>Hello</div>
          </Col>
          <Col>
            <div>Hello</div>
          </Col>
          <Col>
            <div>Hello</div>
          </Col>
          <Col>
            <div>Hello</div>
          </Col>
          <Col>
            <div>Hello</div>
          </Col>
          <Col>
            <div>Hello</div>
          </Col>
          <Col>
            <div>Hello</div>
          </Col>
        </Row>
        <SingleColumnRow padding="medium">
          <Heading elementType="h1" styleType="heading1">Button</Heading>
          <Text>Pretty self explanatory</Text>
          <Button leftIcon={Button.Icomoon.aidKit2} text="Click me!"/>
          <Button rightIcon={Button.Icomoon.aidKit2} text="Click me!"/>
          <Button text="Click me also!" className="bg-positive"/>
          <Button text="Click me also!" className="bg-negative" rounded={true}/>
          <br/>
          <br/>
          <Heading elementType="h1" styleType="heading1">Text</Heading>
          <Text>Also pretty self explanatory</Text>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.Nam vel bibendum est.Etiam dapibus metus ante, ac ultrices sem sollicitudin vel.Pellentesque rhoncus metus at metus viverra tempor.Morbi nunc augue, mollis quis faucibus ac, mattis luctus mauris.Praesent eu eros ut purus ullamcorper congue sit amet eu neque.Vestibulum maximus metus varius risus aliquet efficitur.Praesent placerat ipsum accumsan nulla commodo, eu volutpat enim feugiat.Nam aliquam a eros a scelerisque.
          </Text>
          <br/>
          <br/>
          <Heading elementType="h1" styleType="heading1">Datepicker</Heading>
          <Text>Picks dates</Text>
          <DatePickerInput disabled={true} nativeInput={true} onDateChanged={(d)=> console.log(d)} icon={DatePickerInput.Icomoon.calendar2}/>
          <br/>
          <br/>
          <Heading elementType="h1" styleType="heading1">Dialog</Heading>
          <Text>Is a dialog</Text>
          <Button text="Click me also!" className="bg-brand-primary" onClick={() => this.setState({ dialogOpen: true }) }/>
          <br/>
          <br/>
          <Heading elementType="h1" styleType="heading1">Image</Heading>
          <Text>Again pretty self explanatory</Text>
          <Image height={128} width={128}/>
          <Image height={128} width={128} rounded={true}/>
          <Image height={128} width={128} rounded={true} sampleUser={true}/>
          <Image height={128} width={128} rounded={true} source="http://www.famousbirthdays.com/headshots/jaden-smith-1.jpg"/><br/>
          <br/>
          <br/>
          <Heading elementType="h1" styleType="heading1">Checkbox</Heading>
          <Text margin={{ top: "none", bottom: "small" }}>Again pretty self explanatory</Text>
          <CheckboxInput label="Check me!"/>
          <TextInput leftIcon={TextInput.Icomoon.alarm}/>
          <TextInput rightIcon={TextInput.Icomoon.alarm}/>
        </SingleColumnRow>

      </Grid>
    );
  }
}
