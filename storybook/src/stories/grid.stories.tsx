import * as React from "react"

import { storiesOf } from '@storybook/react';
import { Col, Grid, Row } from "../_symlink";

import "../theme/theme.scss";

storiesOf('Grid', module)
  .add('with 3 columns', () =>
    <Grid debugMode={true} fillContainer={true}>
      <Row>
        <Col>1</Col>
        <Col>2</Col>
        <Col>3</Col>
      </Row>
    </Grid>
  )