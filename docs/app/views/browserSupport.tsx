// IMPORTS
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid, Row, Col } from 'armstrong-react';

export class BrowserSupport extends React.Component<{}, {}> {

  navigateTo(path: string) {
    (this.props as any).history.push(path);
  }

  public render() {
    return (

      <Grid>
        <Row>
          <Col>
            <article>
              <h1>Browser support</h1>

              <p>Armstrong is designed to be a framework for modern web apps, we{`'`}ve done our best to support the most commonly used legacy browsers available but our goal is to provide a lightweight, forward-looking UI framework.Here is the full list of supported browsers: </p>

              <h2 id="macOSX">Mac OSX (Mountain Lion and above) </h2>
              <ul>
                <li>Safari 6.2+</li>
                <li>Chrome (Latest) </li>
                <li>Firefox (Latest) </li>
              </ul>

              <h2 id="windows">Windows (7 and above) </h2>
              <ul>
                <li>IE11</li>
                <li>Microsoft Edge</li>
                <li>Chrome (Latest) </li>
                <li>Firefox (Latest) </li>
                <li>iOS (8 and above) </li>
                <li>Safari 8+ (ios8+1) </li>
                <li>Chrome (Latest) </li>
              </ul>

              <h2 id="android">Android</h2>
              <ul>
                <li>Chrome (Latest) </li>
              </ul>

              <h2 id="windowsPhone">Windows Phone (10 and above) </h2>
              <ul>
                <li>Microsoft Edge</li>
              </ul>

            </article>

          </Col>


          <Col className="secondary-nav" width={200}>
            <ul>
              <li><a href="#macOSX">Mac OSX</a></li>
              <li><a href="#windows">Windows</a></li>
              <li><a href="#android">Android</a></li>
              <li><a href="#windowsPhone">Android</a></li>
            </ul>
          </Col>

        </Row>
      </Grid>


    );
  }
}
