import * as React from 'react';
import { Button } from './../../../source/components/interaction/button';
import { Grid, Row, Col, SingleColumnRow } from './../../../source/components/layout/grid';
import { Image } from './../../../source/components/display/image';


export class Test extends React.Component<{}, { showSubComponent: boolean }> {
  constructor() {
    super();
    this.state = { showSubComponent: false }
  }

  public render() {
    return <Grid fillContainer={true} debugMode={true} style={{ backgroundColor: "red" }}>
      <Row style={{ backgroundColor: "green" }}>
        <Col style={{ backgroundColor: "yellow" }}>
          <Button text="click me" onClick={() => this.setState({ showSubComponent: !this.state.showSubComponent }) }/>
        </Col>
        <Col fixed={300} style={{ backgroundColor: "purple" }}>
        300!
        </Col>
      </Row>
    </Grid>;
  }
}