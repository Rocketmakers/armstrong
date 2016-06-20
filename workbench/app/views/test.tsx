import * as React from 'react';
import { Button } from './../../../source/components/interaction/button';
import { Grid, Row, Col, SingleColumnRow } from './../../../source/components/layout/grid';

import { VelocityComponent, VelocityTransitionGroup } from 'velocity-react';

export class Test extends React.Component<{}, { showSubComponent: boolean }> {
  constructor() {
    super();
    this.state = { showSubComponent: false }
  }

  public render() {
    var v = VelocityComponent;
    return <Grid fillContainer={true}>
      <SingleColumnRow>
        <Button text="click me" onClick={() => this.setState({ showSubComponent: !this.state.showSubComponent }) }/>
        <VelocityComponent animation={{ opacity: this.state.showSubComponent ? 1 : 0 }} duration={500}>
          <div>Hello world!</div>
        </VelocityComponent>
      </SingleColumnRow>
    </Grid>;
  }
}