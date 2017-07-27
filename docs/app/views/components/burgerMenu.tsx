// IMPORTS
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Grid, Row, Col } from 'armstrong-react';

export class BurgerMenuView extends React.Component<{}, {}> {

  navigateTo(path: string) {
    (this.props as any).history.push(path);
  }

  public render() {
    return (

      <Grid>
        <Row>
          <Col>
            <h1>Components: Burger menu</h1>

            <p>Need to do.</p>

          </Col>
        </Row>
      </Grid >


    );
  }
}
