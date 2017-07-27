// IMPORTS
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Grid, Row, Col, Button, Icon } from 'armstrong-react';

export class Buttons extends React.Component<{}, {}> {

  navigateTo(path: string) {
    (this.props as any).history.push(path);
  }

  public render() {
    return (

      <Grid>
        <Row>
          <Col>
            <article>
            <h1>Components: Buttons</h1>

            <pre className="callout major">
              {`import { Button } from 'armstrong-react';`}
            </pre>

            <pre className="callout minor">
              {`<Button className='(string)' onClick='(e?: SyntheticEvent)=> void' leftIcon='(string)' rightIcon='(string)'>Enter button content here</Button>`}
            </pre>

            <table>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>className (string) </td>
                  <td>CSS classnames.Works well with armstrongs bg, fg schemes.</td>
                </tr>
                <tr>
                  <td>leftIcon (string) </td>
                  <td>An icon to the left of the text</td>
                </tr>
                <tr>
                  <td>rightIcon (string) </td>
                  <td>An icon to the right of the text</td>
                </tr>
                <tr>
                  <td>onClick ((e: SyntheticEvent) => void) </td>
                  <td>An event handler for clicking</td>
                </tr>
                <tr>
                  <td>disabled (boolean) </td>
                  <td>Disallows user interaction</td>
                </tr>
              </tbody>
            </table>


            <hr />

            <h1>Examples</h1>

            <h2>Simple buttons</h2>
            <Button className="bg-info">A normal button</Button>
            <Button disabled={true} className="bg-info">A disabled button</Button>

            <pre>
              {`<Button className="bg-info">A normal button</Button>
<Button disabled={true} className="bg-info">A disabled button</Button>`}
            </pre>

            <hr />

            <h2>Buttons with icons</h2>
            <Button className="bg-positive" leftIcon={Icon.Icomoon.floppyDisk}>Save</Button>
            <Button className="bg-negative" rightIcon={Icon.Icomoon.bin2}>Delete</Button>

            <pre>
              {`<Button className="bg-positive" leftIcon={Icon.Icomoon.floppyDisk}>Save</Button>
<Button className="bg-negative" rightIcon={Icon.Icomoon.bin2}>Delete</Button>`}
            </pre>
</article>
          </Col>
        </Row>
      </Grid >


    );
  }
}
