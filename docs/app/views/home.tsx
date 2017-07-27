// IMPORTS
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid, Row, Col } from 'armstrong-react';

export class Home extends React.Component<{}, {}> {

  navigateTo(path: string) {
    (this.props as any).history.push(path);
  }

  public render() {
    return (

      <Grid>
        <Row>
          <Col>
            <div>
              <article>
                <h1 className="headline">A minimal <a target="_blank" href="https://facebook.github.io/react/">React</a>, <a target="_blank" href="http://sass-lang.com/">SASS</a> and <a target="_blank" href="https://www.typescriptlang.org/">Typescript</a> framework for rapid UI design and development.</h1>
                <h2 className="subheading">Armstrong contains a library of essential components and a flexible system of variables designed to cope with the nature and pace of real-world projects.</h2>

                <h3>What's included?</h3>

                <ol>
                  <li><b>Variables: </b> the core of Armstrong. Variable driven properties to improve workflow and make UI more consistent.</li>
                  <li><b>Components: </b> .tsx components that form the base of layout and interaction.</li>
                  <li><b>Addons: </b> optional css-only extras basis that you might find useful as a starting point for your projects.</li>
                </ol>

                <h5>Note: This website makes extensive use of the following addons: Responsive, table styling, typography and form grid.</h5>
              </article>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
          </Col>
        </Row>
      </Grid>
    );
  }
}
