// IMPORTS
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Grid, Row, Col, Image } from 'armstrong-react';

export class Images extends React.Component<{}, {}> {

  navigateTo(path: string) {
    (this.props as any).history.push(path);
  }

  public render() {
    return (

      <Grid>
        <Row>
          <Col>
            <article>
            <h1>Components: Images</h1>

            <p>Usable as both a placeholder (for users and generic) aswell as real images.</p>

            <pre className="callout major">
              {`import { Image } from 'armstrong-react';`}
            </pre>

            <pre className="callout minor">
              {`<Image height='(number)' width='(number)' sampleUser='(boolean)' sampleUserSeed='(string)' rounded='(boolean)' noPlaceholder='(boolean)'/>`}
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
                  <td>rounded (boolean) </td>
                  <td>Makes the image into a circle</td>
                </tr>
                <tr>
                  <td>source (string) </td>
                  <td>The source of the image</td>
                </tr>
                <tr>
                  <td>height (number) </td>
                  <td>The height of the image.Will scale to aspect with width if not set.</td>
                </tr>
                <tr>
                  <td>width (number) </td>
                  <td>The width of the image.Will scale to aspect with height if not set.</td>
                </tr>
                <tr>
                  <td>sampleUser (boolean) </td>
                  <td>If true will pull a random user image from randomuser.me</td>
                </tr>
                <tr>
                  <td>sampleUserSeed (string) </td>
                  <td>Set this to a static value to force the same sample user every time</td>
                </tr>
                <tr>
                  <td>noPlaceholder (boolean) </td>
                  <td>If true will stop any usage of placeholder images</td>
                </tr>
              </tbody>
            </table>


            <hr />

            <h1>Examples</h1>

            <h2>Simple image placeholder</h2>

            <Image height={100} width={100} alt="my image" />

            <pre>
              {`<Image height="100" width="100" alt="my image" />`}
            </pre>

            <hr />

            <h2>Random user photo avatar</h2>

            <Image rounded={true} sampleUser={true} height={75} width={75} alt="avatar" />

            <pre>
              {`<Image rounded={true} sampleUser={true} height="75" width="75" alt="avatar" />`}
            </pre>

            <hr />

            <h2>Same user photo every time</h2>

            <Image rounded={true} sampleUser={true} sampleUserSeed="16" height={75} width={75} alt="avatar" />

            <pre>
              {`<Image rounded={true} sampleUser={true} sampleUserSeed={16} height="75" width="75" alt="avatar" />`}
            </pre>

</article>

          </Col>
        </Row>
      </Grid >


    );
  }
}
