// IMPORTS
import * as React from 'react';
import { browserHistory } from 'react-router';
import { Button } from './../../../source/components/interaction/button';
import { TabControl, TabItem } from './../../../source/components/navigation/tabControl';
import { Grid, Row, Col } from  './../../../source/components/layout/grid';
import { SelectInput } from  './../../../source/components/form/inputs/selectInput';
import { Sample } from './../../../source/components/utility/sample';
import { StateForm } from './../components/stateForm';

export class Home extends React.Component<{}, {}> {
  private tabControl: TabControl;

  public render() {
    return (
      <div>
      <StateForm onSave={(d)=> alert(JSON.stringify(d)) }/>



        <Sample title="Select Input"
        description="A select input with 4 options"
        component={
          <SelectInput change={(i)=> alert(i)} options={[{ id: 1, name: "Talent Matters" }, { id: 2, name: "P3 Hub" }, { id: 3, name: "Pathway toolkit" }]} />
        }/>

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
