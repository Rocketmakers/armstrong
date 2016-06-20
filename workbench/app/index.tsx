// LIBS
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory, IndexRoute } from 'react-router';
import { Grid, Row, Col, SingleColumnRow } from './../../source/components/layout/grid';
import { BurgerMenu } from './../../source/components/navigation/burgerMenu';
import { Heading } from './../../source/components/text/heading'
import { Image } from './../../source/components/display/image';
import { Button } from './../../source/components/interaction/button';
import { BurgerLayout } from './../../source/components/layoutTemplates/burgerLayout';

import {VelocityComponent, VelocityTransitionGroup} from 'velocity-react';


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
  public render() {
    const { pathname } = this.props.location;
    const key = pathname.split('/')[1] || 'root';
    const element = this.props.children || <div/>;
    const elementToAnimate = React.cloneElement(element, { key });
    return (
      <BurgerLayout
        closeOnNavigate={true}
        headerElement={<Heading elementType="h1" styleType="heading1">Armstrong Bench</Heading>}
        navContent={
          <div>
            <Image height={128} width={128} margin={{ right: "medium" }} rounded={true} source="http://www.famousbirthdays.com/headshots/jaden-smith-1.jpg"/>
            <Link data-close="true" to="/" onlyActiveOnIndex={true} activeClassName="active">Home</Link>
            <Link data-close="true" to="/test" activeClassName="active">Test</Link>
          </div>}>
           <VelocityTransitionGroup
          enter={{animation: "fadeIn"}}
          leave={{animation: "fadeOut"}}>
        {elementToAnimate}
        </VelocityTransitionGroup>
      </BurgerLayout>
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
