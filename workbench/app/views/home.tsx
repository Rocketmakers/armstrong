// IMPORTS
import * as React from 'react';
import { browserHistory } from 'react-router';
import { Button } from './../../../source/components/interaction/button';
import { TabControl, TabItem } from './../../../source/components/navigation/tabControl';
import { Grid, Row, Col } from  './../../../source/components/layout/grid';
import { SelectInput } from  './../../../source/components/form/inputs/selectInput';
import { Form } from  './../../../source/components/form/form';
import { DateInput } from  './../../../source/components/form/inputs/dateInput';
import { Sample } from './../../../source/components/utility/sample';
import { Dialog } from '../../../source/components/display/dialog';
import { AutoCompleteInput } from '../../../source/components/form/inputs/autoCompleteInput';
import {SampleForm} from "./sampleForm";

export class Home extends React.Component<{}, { dialogOpen?: boolean, canClick?: boolean }> {
  /**
   *
   */
  constructor() {
    super();
    this.state = { dialogOpen: false, canClick: true }
  }
  private tabControl: TabControl;

  public render() {
    let options = [{ id: 3, name: 'é' }, { id: 4, name: 'e' }, { id: 4, name: 'ę' }];
    return (
      <div>
      <SampleForm sample={{id:"s101", name: "Keith2", tags:[], accepts: true}}/>
      <AutoCompleteInput ignoreDiacritics={true} options={options}/>

      <Dialog title="waddup" isOpen={this.state.dialogOpen} onClose={()=> this.setState({ dialogOpen: false })} footerContent={
        <Button disabled={!this.state.canClick}>OH NO</Button>
      }>
      oh shit, waddup?<Button onClick={()=> this.setState({ canClick: false })}>disable BUTT</Button>
      </Dialog>

        <Sample title="Select Input"
        description="A select input with 4 options"
        component={
          <SelectInput change={(i)=> alert(i)}
          options={[
            { id: 1, name: "Talent Matters" },
            { id: 2, name: "P3 Hub" },
            { id: 3, name: "Pathway toolkit" }]} />
        }/>
        <Button onClick={()=> this.setState({ dialogOpen: true })}>open dialog plz</Button>

        <Sample title="Grid"
        description="A grid with 3 columns"
        component={
          <Grid debugMode={true}>
            <Row>
              <Col>1</Col>
              <Col width="2*">2</Col>
              <Col>3</Col>
            </Row>
          </Grid>
        }/>
        <Sample title="Button"
        description="A green button"
        component={
          <Button className="bg-positive">I am a button, click me!</Button>
        }/>
        <Sample title="Tab control"
        description="A tab control with 4 tabs, one with an icon"
        component={
        <TabControl ref={t => this.tabControl = t}>
          <TabItem title="Tab 1">I am the content for tab 1</TabItem>
          <TabItem title="Tab 2">I am the content for tab 2</TabItem>
          <TabItem title="Tab 3">I am the content for tab 3</TabItem>
          <TabItem title="Tab 4" icon={TabItem.Icomoon.rocket}>I am the content for tab 4</TabItem>
        </TabControl>
      }/>

        <Button className="m-top-large" onClick={() => this.tabControl.changeTab(3)}>Change to tab 4</Button>
      </div>
    );
  }
}
