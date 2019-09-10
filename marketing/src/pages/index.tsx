import * as React from "react"
import Shell from "../layout/shell"
import { Grid, Row, Col, Button } from "armstrong-react"

const Index: React.FC<{}> = () => {
  return (
    <Shell viewClass="home-view">
      <Grid>
        <Row className="rs-small-1col">
          <Col>
            <h2>
              A minimal React, SASS and Typescript framework for rapid UI design and development.
            </h2>
            <p className="p-bottom-large">
              Armstrong contains a library of essential components, a flexible system
              of variables designed to cope with the nature and pace of real-world projects.
            </p>
          </Col>
          <Col width="auto" horizontalAlignment="center">
            <img src={require('../assets/shuttle.svg')} />
          </Col>
        </Row>
        <Row className="p-top-xlarge rs-small-1col">
          <Col className="p-bottom-large">
            <h3>Installation</h3>
            <p className="p-top-small p-bottom-medium">
              Include Bootstrap’s source Sass and JavaScript files via npm, Composer or Meteor. Package managed installs don’t include documentation, but do include our build system and readme
            </p>
            <Button>Get started</Button>
          </Col>
          <Col className="p-bottom-large">
            <h3>Compatibility</h3>
            <p className="p-top-small p-bottom-medium">
              Include Bootstrap’s source Sass and JavaScript files via npm, Composer or Meteor. Package managed installs don’t include documentation, but do include our build system and readme
            </p>
            <Button>Check compatability</Button>
          </Col>
          <Col className="p-bottom-large">
            <h3>Storybook</h3>
            <p className="p-top-small p-bottom-medium">
              Include Bootstrap’s source Sass and JavaScript files via npm, Composer or Meteor. Package managed installs don’t include documentation, but do include our build system and readme
            </p>
            <a className="btn" target="_blank" href="https://rocketmakers.gitlab.io/armstrong/armstrong-react">See the storybook</a>
          </Col>
        </Row>
      </Grid>
    </Shell>
  )
}

export default Index