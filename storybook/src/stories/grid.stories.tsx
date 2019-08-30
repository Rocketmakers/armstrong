import * as React from "react"

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo } from "@storybook/addon-info";
import { Button } from '../_symlink/components/interaction/button';
import { Icon, Col, Grid, Row } from "../_symlink";

import "../theme/theme.scss";

storiesOf('Grid', module)
  .add('with 3 columns', () =>
    <Grid debugMode={true}>
      <Row>
        <Col>1</Col>
        <Col>2</Col>
        <Col>3</Col>
      </Row>
    </Grid>
  )