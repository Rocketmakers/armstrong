// IMPORTS
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as moment from 'moment';
import * as _ from 'underscore';
import { Link } from "react-router";
import { Grid, Row, Col } from './../../../source/components/layout/grid';
import { Button } from './../../../source/components/interaction/button';
import { Icon } from './../../../source/components/display/icon';
import { TabControl, TabItem } from './../../../source/components/navigation/tabControl';

export class Home extends React.Component<{}, { dialogOpen: boolean }> {
  constructor() {
    super();
    this.state = { dialogOpen: false }
  }
  public render() {
    return (
      <Grid debugMode={false} fillContainer={false}>
        <Row className="rs-large-2col">
          <Col>
            <TabControl tabAlignment="right">
              <TabItem title="Tab 1">I am the content for tab 1</TabItem>
              <TabItem title="Tab 2">I am the content for tab 2</TabItem>
              <TabItem title="Tab 3">I am the content for tab 3</TabItem>
              <TabItem title="Tab 4" icon={TabItem.Icomoon.rocket}>I am the content for tab 3</TabItem>
            </TabControl>
          </Col>
        </Row>
      </Grid>
    );
  }
}
