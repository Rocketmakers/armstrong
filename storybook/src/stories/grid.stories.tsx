import * as React from "react"

import { storiesOf } from '@storybook/react';
import { Grid, Row, Col } from "../_symlink";

import "../theme/theme.scss";

storiesOf('Grid', module)
  .addParameters({ options: { showPanel: false } })
  .add('2 rows, 3 columns', () =>
    <Grid debugMode={true} fillContainer={true}>
      <Row>
        <Col>1</Col>
        <Col>2</Col>
        <Col>3</Col>
      </Row>
      <Row>
        <Col>1</Col>
        <Col>2</Col>
        <Col>3</Col>
      </Row>
    </Grid>
  )
  .add('3 columns, 1 fixed', () =>
    <Grid debugMode={true} fillContainer={true}>
      <Row>
        <Col>1</Col>
        <Col>2</Col>
        <Col width={100}>3</Col>
      </Row>
    </Grid>
  )
  .add('Star widths', () =>
    <Grid debugMode={true} fillContainer={true}>
      <Row>
        <Col width="1*">1</Col>
        <Col width="3*">3</Col>
      </Row>
      <Row>
        <Col width="1*">1</Col>
        <Col width="2*">2</Col>
        <Col width="2*">2</Col>
      </Row>
    </Grid>
  )