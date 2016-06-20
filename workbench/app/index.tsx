// LIBS
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory, IndexRoute } from 'react-router';
import { Grid, Row, Col, SingleColumnRow } from './../../source/components/layout/grid';
import { BurgerMenu, BurgerMenuItem } from './../../source/components/navigation/burgerMenu';
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
          <Row fixed={60}>
            <Col fixed={60}>
              {this.state.nav &&
                <BurgerMenu closeOnNavigate={true}>
                  <Image height={128} width={128} margin={{ right: "medium" }} rounded={true} source="http://www.famousbirthdays.com/headshots/jaden-smith-1.jpg"/>
                  <BurgerMenuItem title="Home" onClick={() => this.navigateTo("/") }/>
                  <BurgerMenuItem title="Test" onClick={() => this.navigateTo("/test") }/>
                </BurgerMenu>
              }
            </Col>
            <Col padding="small" centerContent="both">
              <Heading onClick={() => this.setState({ nav: !this.state.nav }) } elementType="h1" styleType="heading1">Armstrong Bench</Heading>
            </Col>
            <Col fixed={60}/>
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