// LIBS
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory, IndexRoute } from 'react-router';
import { Grid, Row, Col, SingleColumnRow } from './../../source/components/layout/grid';
import { BurgerMenu } from './../../source/components/navigation/burgerMenu';
import { Heading } from './../../source/components/text/heading'
import { Image } from './../../source/components/display/image';

// VIEWS
import { Home } from "./views/home";
import { Test } from "./views/test";

// STYLES
import "./theme/theme";

// HISTORY
//const hist = history();

// APP WRAPPER
class App extends React.Component<any, {nav: boolean}> {
  /**
   *
   */
  constructor() {
    super();
    this.state = { nav: true };
  }
  public render() {
    const view = this.props.children;
    return (
      <main>
        <Grid responsive="none" debugMode={true}>
          <Row fixed={100}>
            <Col fixed={true}>
            {this.state.nav &&
              <BurgerMenu closeOnNavigate={true}>
                <Image height={128} width={128} margin={{ right: "medium" }} rounded={true} source="http://www.famousbirthdays.com/headshots/jaden-smith-1.jpg"/>
                <Link data-close="true" to="/" onlyActiveOnIndex={true} activeClassName="active">Home</Link>
                <Link data-close="true" to="/test" activeClassName="active">Test</Link>
              </BurgerMenu>
            }
            </Col>
            <Col padding="small" centerContent="both">
              <Heading onClick={()=> this.setState({ nav: !this.state.nav })} elementType="h1" styleType="heading1">Armstrong Bench</Heading>
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
