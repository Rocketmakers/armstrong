// LIBS
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router, Route } from "react-router";
import { Grid, Row, Col, ArmstrongConfig } from "armstrong-react";

// VIEWS
import { Home } from "./views/home";
import { Test } from "./views/test";
import { List } from "./views/list";
import { Form } from "./views/form";

// STYLES
import "./theme/theme";
import { NewTest } from "./views/newTest";

// HISTORY
//const hist = history();

// APP WRAPPER
class App extends React.Component<any, { nav: boolean }> {
  constructor(props) {
    super(props);
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
            <Col className="bg-gray-dark" />
            <Col width={1100}>{this.props.children}</Col>
            <Col className="bg-gray-dark" />
          </Row>
        </Grid>
      </main>
    );
  }
}

ArmstrongConfig.setLocale("en-GB");

ReactDOM.render(
  <App>
    <NewTest />
  </App>,
  document.getElementById("host")
);
