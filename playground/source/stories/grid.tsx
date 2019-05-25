import { storiesOf } from "../story-host";
import { Grid, Row, Col } from '../_symlink';
import * as React from 'react'

storiesOf("Grid", Grid)
  .add("Basic", () => {
    return (
      <Grid>
        <Row>
          <Col>A1</Col>
          <Col>A2</Col>
        </Row>
        <Row>
          <Col>B1</Col>
          <Col>B2</Col>
        </Row>
      </Grid>
    )
  })
