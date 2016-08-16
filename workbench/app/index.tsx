// LIBS
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory, IndexRoute } from 'react-router';
import { Grid, Row, Col } from './../../source/components/layout/grid';
import { BurgerMenu, BurgerMenuItem } from './../../source/components/navigation/burgerMenu';
import { Image } from './../../source/components/display/image';

// VIEWS
import { Home } from "./views/home";

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
          <Row>
            <Col className="bg-gray-dark"/>
            <Col width={1100} className="p-large">
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
    </Route>
  </Router>
), document.getElementById('host'));