// IMPORTS
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Grid, Row, Col, Icon, Button, TextInput } from 'armstrong-react';

export class Icons extends React.Component<{}, {}> {

  navigateTo(path: string) {
    (this.props as any).history.push(path);
  }

  public render() {
    return (

      <Grid>
        <Row>
          <Col>
            <article>
              <h1>Components: Icons</h1>

              <div className="alert bg-negative">Armstrong is designed to be used with <a className="fg-white" target="_blank" href="https://icomoon.io/preview-ultimate.html">IcoMoon-Ultimate</a>. Because of licensing, you'll have to acquire it yourself.</div>

              <h2 id="installation">Installation Example (Webpack)</h2>

              <h3>Add and import the Icomoon font file</h3>

              <ol>
                <li>Create a new directory called Icomoon in your app/assets/fonts folder.</li>
                <li>Add <code>IcoMoon-Ultimate.ttf</code> to that folder.</li>
                <li>Add the following code to your <code>app/theme/_fonts.scss</code> file.If you do not already have a file named _fonts.scss then just create one and add the following:
                  <pre>{`@font-face {
  font-family: 'IcoMoon-Ultimate';
  font-weight: normal;
  font-style: normal;
  src: url('./../assets/fonts/icomoon/IcoMoon-Ultimate.ttf') format('truetype');
}`}
                  </pre>

                </li>
                <li>Add <code> @import "fonts"; </code> to the TOP of your <code>app/theme/theme.scss</code> file.</li>
              </ol>
              <br/>
              <h3>Add the Icomoon definitions</h3>

              <ol>
                <li>Visit the <a href="https://github.com/Rocketmakers/armstrong-react-addons/blob/master/_icomoon.scss">Armstrong add-ons page for _icomoon.scss</a> and add this file to your <code>app/theme/addons</code> folder.</li>
                <li>Add <code> @import "addons/icomoon"; </code> just below <code> @import "fonts"; </code> import in your <code>app/theme/theme.scss</code> file.The top of your theme file should now look like this:
                  <pre>{`@import "fonts";
@import "addons/icomoon";

@import "~armstrong-react/dist/imports";
@import "~armstrong-react/dist/style";
`}
                  </pre>
                </li>
              </ol>


              <h3>Import and use</h3>

              <ol>
                <li>Add the following import at the top of your tsx file.
                  <pre>
                    {`import { Icon } from 'armstrong-react';`}
                  </pre></li>
                <li>And use the Icon as follows:
                  <pre>
                    {`<Icon icon={Icon.Icomoon.arrowLeft2} />`}
                  </pre></li>
              </ol>

              <h2 id="examples">Examples</h2>

              <h3>Simple icon</h3>

              <Icon icon={Icon.Icomoon.rocket} />

              <pre>{`<Icon icon={Icon.Icomoon.rocket} />`}
              </pre>

              <h3>Simple icon with variables</h3>

              <Icon className="f-size-large fg-color-info" icon={Icon.Icomoon.rocket} />

              <pre>{`<Icon className="f-size-large fg-color-info" icon={Icon.Icomoon.rocket} />`}
              </pre>

              <h3>Icon in a button</h3>

              <Button className="bg-info" leftIcon={Icon.Icomoon.floppyDisk}>Save</Button>

              <pre>{`<Button className="bg-negative" leftIcon={Icon.Icomoon.floppyDisk}>Save</Button>`}
              </pre>

              <h3>Icon in a form element</h3>

              <TextInput leftIcon={Icon.Icomoon.user} placeholder="Enter your username" />

              <pre>{`<TextInput icon={Icon.Icomoon.user} placeholder="Enter your username" />`}
              </pre>




            </article>
          </Col>

<Col className="secondary-nav" width={200}>

          <ul>
          <li><a href="#installation">Installation</a></li>
          <li><a href="#examples">Examples</a></li>
          </ul>

          </Col>

        </Row>
      </Grid >


    );
  }
}
