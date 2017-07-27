// IMPORTS
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid, Row, Col } from 'armstrong-react';

export class HowToUpdate extends React.Component<{}, {}> {

  navigateTo(path: string) {
    (this.props as any).history.push(path);
  }

  public render() {
    return (

      <Grid>
        <Row>
          <Col>
            <article>
              <h1>Get Started: How to update</h1>
              <ol>
              <li>Clone the repository : <pre>git clone git@github.com:Rocketmakers/armstrong-react.git</pre></li>
              <li>Switch to the directory and install <pre>cd armstrong-react && npm i</pre></li>
              <li>Switch to the workbench directory and install <pre>cd workbench && npm i</pre></li>
              <li>Start workbench <pre>npm start</pre></li>
              <li><b>Test thoroughly!</b></li>
              <li>When you're finished making changes, kill the watcher and commit your changes <pre>git commit -a</pre></li>
              <li>Then just run <pre>npm run patch-publish</pre></li>
              <li>Push your changes and let anyone who needs to know what you've updated.</li>
              </ol>
            </article>
          </Col>

        </Row>
      </Grid>


    );
  }
}
