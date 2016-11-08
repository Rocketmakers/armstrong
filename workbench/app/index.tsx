// LIBS
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory, IndexRoute } from 'react-router';
import { Grid, Row, Col } from './../../source/components/layout/grid';
import { BurgerMenu, BurgerMenuItem } from './../../source/components/navigation/burgerMenu';
import { Image } from './../../source/components/display/image';

// VIEWS
import { Home } from "./views/home";

import { setLocale } from "../../source/config/config";

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
        <Grid debugMode={true} fillContainer={true}>
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

setLocale("en-GB");

ReactDOM.render(<App><Home /></App>, document.getElementById('host'));
