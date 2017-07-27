// IMPORTS
import * as React from 'react';
import { Link } from 'react-router';
import * as ReactDOM from 'react-dom';

import { Grid, Row, Col, TextInput, SelectInput, CalendarInput, Icon, Button } from 'armstrong-react';

export class FormValidation extends React.Component<{}, {}> {

  navigateTo(path: string) {
    (this.props as any).history.push(path);
  }

  public render() {
    return (

      <Grid>
        <Row>
          <Col>
            <article>
              <h1><Link to="/addons/">Addons: </Link> Form Validation</h1>

              <p>The form validation helper adds a few classes for easy form validation styling.</p>

              <h2 id="installation">Installation: </h2>

              <p>Visit the <a href="https://github.com/Rocketmakers/armstrong-react-addons" target="_blank">armstrong-react-addons repo</a>, download <code>formValidation.scss</code>, add it to your <code>app/theme/</code> folder and then add the following to your <code>app/theme/theme.scss</code> file: </p>

              <pre className="callout major">
                @import "path/to/formValidation";
              </pre>

              <h2 id="howItWorks">How it works: </h2>

              <p>Add <code>className="invalid"</code> to: or any input/select style control.</p>
              <ul>
                <li>Layout components: <code>{`<Grid />`}</code>, <code>{`<Row />`}</code>, <code>{`<Col />`}</code></li>
                <li>Form elements e.g.<code>{`<TextInput />`}</code> or <code>{`<CalendarInput />`}</code></li>
              </ul>

              <hr />

              <h2 id="examples">Examples: </h2>

              <h3>Invalid field</h3>

              <Grid className="form-grid rs-medium-1col">
                <Row>
                  <Col>
                    <label>First name</label>
                    <TextInput defaultValue="John" />
                  </Col>
                  <Col>
                    <label>Last name</label>
                    <TextInput className="invalid" defaultValue="Smith" />
                  </Col>
                </Row>
              </Grid>

              <pre> {`<Grid className="form-grid rs-medium-1col">
  <Row>
    <Col>
      <label>First name</label>
      <TextInput defaultValue="John" />
    </Col>
    <Col>
      <label>Last name</label>
      <TextInput className="inactive" defaultValue="Smith" />
    </Col>
  </Row>
</Grid>`}
              </pre>

              <hr />

              <h3>Invalid column</h3>

              <Grid className="form-grid rs-medium-1col">
                <Row>
                  <Col>
                    <label>First name</label>
                    <TextInput defaultValue="John" />
                  </Col>
                  <Col className="invalid">
                    <label>Last name</label>
                    <TextInput defaultValue="Smith" />
                  </Col>
                </Row>
              </Grid>

              <pre> {`<Grid className="form-grid rs-medium-1col">
  <Row>
    <Col>
      <label>First name</label>
      <TextInput defaultValue="John" />
    </Col>
    <Col className="inactive">
      <label>Last name</label>
      <TextInput defaultValue="Smith" />
    </Col>
  </Row>
</Grid>`}
              </pre>

              <hr />


              <h3>Invalid row</h3>

              <Grid className="form-grid rs-medium-1col">
                <Row className="invalid">
                  <Col>
                    <label>First name</label>
                    <TextInput defaultValue="John" />
                  </Col>
                  <Col>
                    <label>Last name</label>
                    <TextInput defaultValue="Smith" />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <label>Address</label>
                    <CalendarInput icon={Icon.Icomoon.calendar2}/>
                  </Col>
                  <Col>
                    <label>Post code</label>
                    <TextInput />
                  </Col>
                </Row>
              </Grid>

              <pre> {`<Grid className="form-grid rs-medium-1col">
  <Row className="invalid">
    <Col>
      <label>First name</label>
      <TextInput defaultValue="John" />
    </Col>
    <Col className="inactive">
      <label>Last name</label>
      <TextInput defaultValue="Smith" />
    </Col>
  </Row>
  <Row>
    <Col>
      <label>Address</label>
      <CalendarInput icon={Icon.Icomoon.calendar2}/>
    </Col>
    <Col>
      <label>Post code</label>
      <TextInput />
    </Col>
  </Row>
</Grid>`}
              </pre>

              <hr />




              <h3>Invalid grid</h3>

              <Grid className="form-grid rs-medium-1col invalid">
                <Row>
                  <Col>
                    <label>First name</label>
                    <TextInput defaultValue="John" />
                  </Col>
                  <Col>
                    <label>Last name</label>
                    <TextInput defaultValue="Smith" />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <label>Address</label>
                    <CalendarInput icon={Icon.Icomoon.calendar2}/>
                  </Col>
                  <Col>
                    <label>Post code</label>
                    <TextInput />
                  </Col>
                </Row>
              </Grid>

              <pre> {`<Grid className="form-grid rs-medium-1col invalid">
  <Row>
    <Col>
      <label>First name</label>
      <TextInput defaultValue="John" />
    </Col>
    <Col className="inactive">
      <label>Last name</label>
      <TextInput defaultValue="Smith" />
    </Col>
  </Row>
  <Row>
    <Col>
      <label>Address</label>
      <CalendarInput icon={Icon.Icomoon.calendar2}/>
    </Col>
    <Col>
      <label>Post code</label>
      <TextInput />
    </Col>
  </Row>
</Grid>`}
              </pre>

              <hr />


              <h3>Invalid column with explanatory text</h3>

              <Grid className="form-grid">
                <Row>
                  <Col>
                    <label>First name</label>
                    <TextInput placeholder="Enter your first name here" />
                  </Col>
                  <Col>
                    <label>Last name</label>
                    <TextInput placeholder="Enter your last name here" />
                  </Col>
                </Row>
                <Row>
                  <Col className="invalid">
                    <label>Email address</label>
                    <TextInput defaultValue="john@com" rightIcon={Icon.Icomoon.warning2} placeholder="e.g. yourname@example.com" />
                    <div className="validation fg-negative">Your email address is not valid!</div>
                    <div className="validation fg-negative">You must use your @rocketmakers address!</div>
                  </Col>
                </Row>
              </Grid>

              <pre> {`<Grid className="form-grid">
  <Row>
    <Col>
      <label>First name</label>
      <TextInput placeholder="Enter your first name here" />
    </Col>
    <Col>
      <label>Last name</label>
      <TextInput placeholder="Enter your last name here" />
    </Col>
  </Row>
  <Row>
    <Col className="invalid">
      <label>Email address</label>
      <TextInput defaultValue="john.com" rightIcon={Icon.Icomoon.warning2} placeholder="e.g. yourname@example.com" />
      <div className="validation fg-negative">Your email address is not valid!</div>
      <div className="validation fg-negative">You must use your @rocketmakers address!</div>
    </Col>
  </Row>
</Grid>`}
              </pre>


            </article>

          </Col>

          <Col className="secondary-nav" width={200}>

            <ul>
              <li><a href="#installation">Installation</a></li>
              <li><a href="#howItWorks">How it works</a></li>
              <li><a href="#examples">Examples</a></li>
            </ul>

          </Col>

        </Row>
      </Grid >

    );
  }
}
