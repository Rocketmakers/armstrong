// LIBS
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory, IndexRoute } from 'react-router';
import { Grid, Row, Col, SingleColumnRow, FixedCentralColumnRow } from './../../source/components/layout/grid';
import { BurgerMenu, BurgerMenuItem } from './../../source/components/navigation/burgerMenu';
import { Image } from './../../source/components/display/image';

// VIEWS
import { Home } from "./views/home";
import { Test } from "./views/test";

// STYLES
import "./theme/theme";

// HISTORY
//const hist = history();

// APP WRAPPER
class App extends React.Component<any, { nav: boolean }> {
  constructor() {
    super();
    this.state = { nav: true };
  }
  navigateTo(path: string) {
    (this.props as any).history.push(path);
  }
  public render() {
    const view = this.props.children;
    return (
      <main>
        <Grid debugMode={false} fillContainer={true}>
          <Row fixed={60} className="bg-brand-primary fg-white header">
            <Col centerContent="both">
              <h1 className="m-none" onClick={() => this.setState({ nav: !this.state.nav }) }>Armstrong Bench</h1>
            </Col>
          </Row>
          <Row>
            <Col className="bg-gray-dark"/>
            <Col fixed={1100} className="p-large">
              { this.props.children }
            </Col>
            <Col className="bg-gray-dark"/>
          </Row>
        </Grid>
      </main>
    );
  }
}

// ROUTER
ReactDOM.render((
  <Router history={ hashHistory }>
    <Route path="/" component={ App }>
      <IndexRoute component={ Home } />
      <Route path="test" component={ Test } />
    </Route>
  </Router>
), document.getElementById('host'));