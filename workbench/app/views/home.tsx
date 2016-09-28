// IMPORTS
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as moment from 'moment';
import * as _ from 'underscore';
import { Link } from "react-router";
import { Grid, Row, Col } from './../../../source/components/layout/grid';
import { Button } from './../../../source/components/interaction/button';

export class Home extends React.Component<{}, { dialogOpen: boolean }> {
  /**
   *
   */
  constructor() {
    super();
    this.state = { dialogOpen: false }
  }
  public render() {
    return (
        <Grid debugMode={false} fillContainer={false}>
          <Row>
          <Col><Button>I am button</Button></Col>
          </Row>

        </Grid>
    );
  }
}
