// IMPORTS
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as moment from 'moment';
import { Grid, Row, Col, SingleColumnRow } from './../../../source/components/layout/grid';
import { Heading } from './../../../source/components/text/heading';
import { Button } from './../../../source/components/interaction/button';
import { Text } from './../../../source/components/text/text';
import { Image } from './../../../source/components/display/image';
import { DatePickerInput } from './../../../source/components/form/inputs/datePickerInput';
import { Dialog } from './../../../source/components/display/dialog';

interface HomeState{
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
      <Grid responsive="none" debugMode={false}>
      <Dialog title="I am a dialog!" isOpen={this.state.dialogOpen} onClose={()=> this.setState({ dialogOpen: false })}>
      hello world!
      </Dialog>
        <Row fixed={true}>
          <Col padding="small" centerContent="both">
            <Heading elementType="h1" styleType="heading1">Armstrong Bench</Heading>
          </Col>
        </Row>
        <SingleColumnRow padding="medium">
          <Heading elementType="h1" styleType="heading1">Button</Heading>
          <Text margin={{ top: "none", bottom: "small" }}>Pretty self explanatory</Text>
          <Button text="Click me!"/>
          <Button text="Click me also!" condition="positive"/>
          <Button text="Click me also!" condition="negative" rounded={true}/>
          <br/>
          <br/>
          <Heading elementType="h1" styleType="heading1">Text</Heading>
          <Text margin={{ top: "none", bottom: "small" }}>Also pretty self explanatory</Text>
          <Text margin={{ top: "none", bottom: "small" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.Nam vel bibendum est.Etiam dapibus metus ante, ac ultrices sem sollicitudin vel.Pellentesque rhoncus metus at metus viverra tempor.Morbi nunc augue, mollis quis faucibus ac, mattis luctus mauris.Praesent eu eros ut purus ullamcorper congue sit amet eu neque.Vestibulum maximus metus varius risus aliquet efficitur.Praesent placerat ipsum accumsan nulla commodo, eu volutpat enim feugiat.Nam aliquam a eros a scelerisque.
          </Text>
          <br/>
          <br/>
          <Heading elementType="h1" styleType="heading1">Image</Heading>
          <Text margin={{ top: "none", bottom: "small" }}>Again pretty self explanatory</Text>
          <Image height={128} width={128} margin={{right: "medium"}}/>
          <Image height={128} width={128} margin={{right: "medium"}} rounded={true}/>
          <Image height={128} width={128} margin={{right: "medium"}} rounded={true} sampleUser={true}/><br/>
          <br/>
          <br/>
          <Heading elementType="h1" styleType="heading1">Datepicker</Heading>
          <Text margin={{ top: "none", bottom: "small" }}>Picks dates</Text>
          <DatePickerInput/>
          <br/>
          <br/>
          <Heading elementType="h1" styleType="heading1">Dialog</Heading>
          <Text margin={{ top: "none", bottom: "small" }}>Is a dialog</Text>
          <Button text="Click me also!" condition="positive" onClick={()=> this.setState({ dialogOpen: true })}/>
        </SingleColumnRow>

      </Grid>
    );
  }
}
