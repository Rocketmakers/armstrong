import * as React from "react";
import { Button } from './../interaction/button';
import { Grid, Row, Col, SingleColumnRow } from './../layout/grid';



import { VelocityComponent } from 'velocity-react';


declare var Velocity;

interface IBurgerLayoutProps extends React.Props<BurgerLayout> {
  headerElement?: any;
  navContent?: any;
  closeOnNavigate?: boolean;
}

interface IBurgerLayoutState {
  isOpen: boolean;
}

export class BurgerLayout extends React.Component<IBurgerLayoutProps, IBurgerLayoutState> {
  constructor() {
    super();
    this.state = { isOpen: false }
  }

  handleClick(e){
    if (e.target.nodeName === "A"){
      if (this.props.closeOnNavigate){
        this.setState({ isOpen: false });
      }
    }
  }
  render() {
    return (
        <VelocityComponent animation={{ translateX: this.state.isOpen ? 300 : 0 }} duration={1000}>
          <div className="velocity-wrapper">
            <nav onClick={e=> this.handleClick(e)}>
              {this.props.navContent}
            </nav>
            <main>
              <Grid className="layout-grid" fillContainer={true} debugMode={true}>
                <Row fixed={75}>
                  <Col fixed={true}>
                    <Button text="B" onClick={() => this.setState({ isOpen: !this.state.isOpen }) }/>
                  </Col>
                  <Col padding="small" centerContent="both">
                    {this.props.headerElement}
                  </Col>
                </Row>
                <SingleColumnRow>
                <div className="body-scroll">
                  {this.props.children}
                  </div>
                </SingleColumnRow>
              </Grid>
            </main>
          </div>
        </VelocityComponent>
    )
  }
}