// LIBS
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory, IndexRoute } from 'react-router';
import { Grid, Row, Col, SingleColumnRow } from './../../source/components/layout/grid';
import { BurgerMenu } from './../../source/components/navigation/burgerMenu';
import { Heading } from './../../source/components/text/heading'

// VIEWS
import { Home } from "./views/home";
import { Test } from "./views/test";

// STYLES
import "./theme/theme";

// HISTORY
//const hist = history();

// APP WRAPPER
class App extends React.Component<any, {}> {
  public render() {
    const view = this.props.children;
    return (
      <main>
        <Grid responsive="none" debugMode={true}>
          <Row fixed={100}>
            <Col fixed={true}>
              <BurgerMenu>
                <Link to="/" onlyActiveOnIndex={true} activeClassName="active">Home</Link>
                <Link to="/test" activeClassName="active">Test</Link>
              </BurgerMenu>
            </Col>
            <Col padding="small" centerContent="both">
              <Heading elementType="h1" styleType="heading1">Armstrong Bench</Heading>
            </Col>
          </Row>
          <SingleColumnRow>
            { this.props.children }
          </SingleColumnRow>
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
), document.getElementById('app-content'));
