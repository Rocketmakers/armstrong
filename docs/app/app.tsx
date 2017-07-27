// LIBS
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as fastclick from "fastclick";
import { Router, Route, Link, hashHistory, IndexRoute } from 'react-router';

// ROOT VIEWS
import { Home } from "./views/home";
import { BrowserSupport } from "./views/browserSupport";

// GET STARTED VIEWS
import { Installation } from "./views/getStarted/installation";
import { HowToUpdate } from "./views/getStarted/howToUpdate";
import { VariablesAndClasses } from "./views/getStarted/variablesAndClasses";

// COMPONENTS VIEWS
import { GridSystem } from "./views/components/gridSystem";
import { FormElements } from "./views/components/formElements";
import { Buttons } from "./views/components/buttons";
import { Icons } from "./views/components/icons";
import { Images } from "./views/components/images";
import { DialogView } from "./views/components/dialog";
import { BurgerMenuView } from "./views/components/burgerMenu";
import { TabControlView } from "./views/components/tabControlView";

// addons VIEWS
import { AddOns } from "./views/addons/addons";
import { Responsive } from "./views/addons/responsive";
import { FormGrid } from "./views/addons/formGrid";
import { FormValidation } from "./views/addons/formValidation";
import { Typography } from "./views/addons/typography";
import { TableStyling } from "./views/addons/tableStyling";
import { Tooltip } from "./views/addons/tooltip";

import { Grid, Row, Col, Image, BurgerMenu, BurgerMenuItem, Icon } from 'armstrong-react';

// STYLES
import "./theme/theme.scss";

// HISTORY
//const hist = history();

// APP WRAPPER
class App extends React.Component<any, {}> {
  navigateTo(path: string) {
    (this.props as any).history.push(path);
  }

  private routeTo(path: string) {
    this.props.history.push(path);
  }

  public render() {
    const view = this.props.children;
    return (
      <main>

        <Grid fillContainer={true}>
          <Row>
            <Col className="sidebar rs-medium-hide" width={225}>
              <nav>
                <Link activeClassName="active" onlyActiveOnIndex={true} to="/">Home</Link>

                <h3>Get Started</h3>
                <Link activeClassName="active" to="/getStarted/installation">Installation</Link>
                <Link activeClassName="active" to="/getStarted/howToUpdate">How to update</Link>
                <Link activeClassName="active" to="/getStarted/variablesAndClasses">Variables &amp; Classes</Link>

                <h3>Components</h3>
                <Link activeClassName="active" to="/components/gridSystem">Grid system</Link>
                <Link activeClassName="active" to="/components/tabControl">Tab control</Link>
                <Link activeClassName="active" to="/components/formElements">Immutable form</Link>
                <Link activeClassName="active" to="/components/buttons">Buttons</Link>
                <Link activeClassName="active" to="/components/icons">Icons</Link>
                <Link activeClassName="active" to="/components/images">Images</Link>
                <Link activeClassName="active" to="/components/dialog">Dialog</Link>

                <h3>Other bits</h3>
                <Link activeClassName="active" to="/browserSupport">Browser support</Link>
                <Link activeClassName="active" to="/addons/">Addons</Link>

                <div className="m-top-medium">
                  <a style={{ textDecoration: "none" }} href="https://github.com/Rocketmakers/armstrong-react" target="_blank"><Icon className="f-size-large" icon={Icon.Icomoon.github} /></a>
                </div>
              </nav>
            </Col>
            <Col className="main-content">
              <Grid>
                <Row className="m-bottom-xlarge">
                  <Col className="rs-xlarge-hide rs-medium-show" verticalAlignment="center" width="auto">
                    <BurgerMenu buttonIcon={Icon.Icomoon.menu7} closeOnNavigate={true}>
                      <BurgerMenuItem title="Home" onClick={() => this.navigateTo("/") }/>
                      <h3>Get started</h3>
                      <BurgerMenuItem title="Installation" onClick={() => this.navigateTo("/getStarted/installation") }/>
                      <BurgerMenuItem title="How to update" onClick={() => this.navigateTo("/getStarted/howToUpdate") }/>
                      <BurgerMenuItem title="Variables and Classes" onClick={() => this.navigateTo("/getStarted/variablesAndClasses") }/>
                      <h3>Components</h3>
                      <BurgerMenuItem title="Grid system" onClick={() => this.navigateTo("/components/gridSystem") }/>
                      <BurgerMenuItem title="Tab control" onClick={() => this.navigateTo("/components/tabControl") }/>
                      <BurgerMenuItem title="Immutable form" onClick={() => this.navigateTo("/components/formElements") }/>
                      <BurgerMenuItem title="Buttons" onClick={() => this.navigateTo("/components/buttons") }/>
                      <BurgerMenuItem title="Icons" onClick={() => this.navigateTo("/components/icons") }/>
                      <BurgerMenuItem title="Images" onClick={() => this.navigateTo("/components/images") }/>
                      <BurgerMenuItem title="Dialog" onClick={() => this.navigateTo("/components/dialog") }/>
                      {/*<BurgerMenuItem title="Burger menu" onClick={() => this.navigateTo("/components/burgerMenu") }/>*/}

                      <h3>Other bits</h3>

                      <BurgerMenuItem title="Browser Support" onClick={() => this.navigateTo("/browserSupport") }/>
                      <BurgerMenuItem title="Addons" onClick={() => this.navigateTo("/addons/") }/>

                      <div className="m-top-medium">
                        <a style={{ textDecoration: "none" }} href="https://github.com/Rocketmakers/armstrong-react" target="_blank"><Icon className="f-size-large" icon={Icon.Icomoon.github} /></a>
                      </div>
                    </BurgerMenu>
                  </Col>
                  <Col className="rs-xlarge-show rs-medium-hide" verticalAlignment="center">
                    <h1 className="header-title">Armstrong</h1>
                    <h2 className="header-description">A React/SASS framework for rapid UI</h2>
                  </Col>
                </Row>
                <Row className="p-top-xsmall">
                  <Col>
                    { this.props.children }
                    <footer>
                      &copy; {new Date().getFullYear() } <a target="_blank" href="http://www.rocketmakers.com">Rocketmakers</a>
                    </footer>
                  </Col>
                </Row>
              </Grid>

            </Col>
          </Row>
        </Grid>

      </main>
    );
  }
  componentDidMount() {
    // Fastclick eliminates click-lag to give a more 'native' feeling experience. Don't remove it.
    fastclick.attach(document.body);
  }
}

// ROUTER
ReactDOM.render((
  <Router history={ hashHistory }>
    <Route path="/" component={ App }>

      <IndexRoute component={ Home } />
      <Route path="browserSupport" component={ BrowserSupport } />

      <Route path="getStarted/installation" component={ Installation } />
      <Route path="getStarted/howToUpdate" component={ HowToUpdate } />
      <Route path="getStarted/variablesAndClasses" component={ VariablesAndClasses } />

      <Route path="components/gridSystem" component={ GridSystem } />
      <Route path="components/formElements" component={ FormElements } />
      <Route path="components/tabControl" component={ TabControlView } />
      <Route path="components/buttons" component={ Buttons } />
      <Route path="components/icons" component={ Icons } />
      <Route path="components/images" component={ Images } />
      <Route path="components/dialog" component={ DialogView } />
      <Route path="components/burgerMenu" component={ BurgerMenuView } />

      <Route path="addons/" component={ AddOns } />
      <Route path="addons/responsive" component={ Responsive } />
      <Route path="addons/formGrid" component={ FormGrid } />
      <Route path="addons/formValidation" component={ FormValidation } />
      <Route path="addons/typography" component={ Typography } />
      <Route path="addons/tableStyling" component={ TableStyling } />
      <Route path="addons/tooltip" component={ Tooltip } />

    </Route>
  </Router>
), document.getElementById('host'));
