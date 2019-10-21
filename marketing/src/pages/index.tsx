import * as React from "react"
import Shell from "../layout/shell"
import { Grid, Row, Col, Button, Icon } from "@rocketmakers/armstrong"

import "../theme/theme.scss";
import "./index.scss";
import { ArmstrongGraphic } from "../components/armstrongGraphic";

const Index: React.FC<{}> = () => {
  return (
    <Shell viewClass="home-view">
      <Grid>
        <Row className="rs-small-1col">
          <Col className="hero-text">
            <h2>
              A minimal <a href="https://reactjs.org" target="_blank">React</a>, <a href="https://sass-lang.com/" target="_blank">SASS</a> and <a href="https://www.typescriptlang.org/" target="_blank">Typescript</a> framework for rapid UI design and development.
            </h2>
            <p className="p-bottom-large f-size-large p-top-medium">
              Armstrong contains a library of essential components, a flexible system
              of variables designed to cope with the nature and pace of real-world projects.
            </p>
          </Col>
          <Col horizontalAlignment="center">
            <ArmstrongGraphic />
          </Col>
        </Row>
        <Row className="p-top-xlarge rs-small-1col">
          <div className="grid-container">
            <Col className="p-bottom-large">
              <div className="flex-container">
                <Icon icon={Icon.Icomoon.download} className="p-right-small f-size-large" /><h3>Installation</h3>
              </div>
              <p className="p-top-small p-bottom-medium">
                Include Bootstrap’s source Sass and JavaScript files via npm, Composer or Meteor. Package managed installs don’t include documentation, but do include our build system and readme
                </p>
              <Button>Get started</Button>
            </Col>
            <Col className="p-bottom-large">
              <div className="flex-container">
                <Icon icon={Icon.Icomoon.stack3} className="p-right-small f-size-large" /><h3>Compatability</h3>
              </div>
              <p className="p-top-small p-bottom-medium">
                Armstrong supports all modern browsers and was designed to respond to all device sizes.
              </p>
              <div className="flex-container">
                <img src={require('../assets/IE.svg')} /><img src={require('../assets/firefox.svg')} /><img src={require('../assets/edge.svg')} /><img src={require('../assets/chrome.svg')} /><img src={require('../assets/safari.svg')} />
              </div>
              <Button>Check compatability</Button>
            </Col>
            <Col className="p-bottom-large">
              <div className="flex-container">
                <Icon icon={Icon.Icomoon.book3} className="p-right-small f-size-large" /><h3>Storybook</h3>
              </div>
              <p className="p-top-small p-bottom-medium">
                Include Bootstrap’s source Sass and JavaScript files via npm, Composer or Meteor. Package managed installs don’t include documentation, but do include our build system and readme
              </p>
              <a className="btn" target="_blank" href="https://rocketmakers.github.io/armstrong/">See the storybook</a>
            </Col>
          </div>
        </Row>
      </Grid>
    </Shell>
  )
}

export default Index