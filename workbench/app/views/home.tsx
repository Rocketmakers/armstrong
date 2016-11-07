// IMPORTS
import * as React from 'react';
import { Button } from './../../../source/components/interaction/button';
import { TabControl, TabItem } from './../../../source/components/navigation/tabControl';
import { Grid, Row, Col } from  './../../../source/components/layout/grid';
import { SelectInput } from  './../../../source/components/form/inputs/selectInput';

export class Home extends React.Component<{}, {}> {
  private tabControl: TabControl;

  public render() {
    return (
      <div>
        <TabControl ref={t => this.tabControl = t}>
          <TabItem title="Tab 1">I am the content for tab 1</TabItem>
          <TabItem title="Tab 2">I am the content for tab 2</TabItem>
          <TabItem title="Tab 3">I am the content for tab 3</TabItem>
          <TabItem title="Tab 4" icon={TabItem.Icomoon.rocket}>I am the content for tab 4</TabItem>
        </TabControl>
        <Button className="m-top-large" onClick={() => this.tabControl.changeTab(3)}>Change to tab 4</Button>
        <SelectInput change={(i)=> alert(i)} options={[{ id: 1, name: "Talent Matters" }, { id: 2, name: "P3 Hub" }, { id: 3, name: "Pathway toolkit" }]} />
        <Grid>
        <Row/>
        </Grid>
      </div>
    );
  }
}
