import * as React from "react"
import { storiesOf } from '@storybook/react';
import { Grid, Row, Col } from "../src/_symlink";

storiesOf('Welcome', module)
  .addParameters({
    options: {
      showAddonPanel: false
    },
    info: {
      inline: false
    }
  })
  .add('to Armstrong', () => (
    <Grid className="intro-view">
      <Row>
        <Col width={600}>
          <h2>
            A minimal React, SASS and Typescript framework for rapid UI design and development.
          </h2>
          <p>
            Armstrong contains a library of essential components, a flexible system of variables designed to cope with the nature and pace of real-world projects.
          </p>
        </Col>
        <Col>
          <img src={require('../src/assets/images/capsule.png')} />
        </Col>
      </Row>
    </Grid>
  )
  )