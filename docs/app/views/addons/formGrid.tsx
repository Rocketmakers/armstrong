// IMPORTS
import * as React from 'react';
import { Link } from 'react-router';
import * as ReactDOM from 'react-dom';

import { Grid, Row, Col, TextInput, SelectInput, CalendarInput, Icon, Button } from 'armstrong-react';

export class FormGrid extends React.Component<{}, {}> {

  navigateTo(path: string) {
    (this.props as any).history.push(path);
  }

  public render() {
    return (

      <Grid>
        <Row>
          <Col>
            <article>
            <h1><Link to="/addons/">Addons:</Link> Form Grid</h1>

            <p>The form grid helper for Armstrong is a handy helper that will help you create good looking forms quickly. Form grid works best with the responsive helper.</p>

            <h2 id="installation">Installation: </h2>

            <p>Visit the <a href="https://github.com/Rocketmakers/armstrong-react-addons" target="_blank">armstrong-react-addons repo</a>, download <code>formGrid.scss</code>, add it to your <code>app/theme/</code> folder and then add the following to your <code>app/theme/theme.scss</code> file:</p>

            <pre className="callout major">
              @import "path/to/formGrid";
            </pre>

            <h2 id="howItWorks">How it works: </h2>

            <p>Add <code>className="form-grid"</code> to any instance of <code>{`<Grid />`}</code> to have the effects of form grid automatically applied.Form grid makes the following assumptions on your grid: </p>
            <ul>
              <li>You want labels to appear above form elements.</li>
              <li>You want both horizontal and vertical spacing between columns.</li>
              <li>You do not want a margin-bottom on the final row of your form-grid.</li>
            </ul>

            <hr />

            <h2 id="examples">Examples: </h2>

            <h3>Simple form (with responsive helper)</h3>

            <Grid className="form-grid rs-medium-1col">
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
                <Col>
                  <label>Email address</label>
                  <TextInput placeholder="e.g. yourname@example.com" />
                </Col>
                <Col>
                  <label>Date of birth</label>
                  <CalendarInput icon={Icon.Icomoon.calendar2} />
                </Col>
              </Row>
            </Grid>

            <pre> {`<Grid className="form-grid rs-medium-1col">
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
    <Col>
      <label>Email address</label>
      <TextInput placeholder="e.g. yourname@example.com" />
    </Col>
    <Col>
      <label>Date of birth</label>
      <CalendarInput icon={CalendarInput.Icomoon.calendar2} />
    </Col>
  </Row>
</Grid>`}
            </pre>

            <hr />

            <h3>Nested form grids (with responsive helper)</h3>

            <Grid className="form-grid rs-medium-1col">
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
                <Col>
                  <label>Long card number</label>
                  <TextInput />
                </Col>
                <Col>
                  <label>Expiry date</label>
                  <Grid className="form-grid">
                    <Row>
                      <Col><SelectInput placeholder="MM" options={[{ id: 1, name: "01" }, { id: 2, name: "02" }, { id: 3, name: "03" }, { id: 3, name: "04" }, { id: 3, name: "04" }, { id: 3, name: "05" }, { id: 3, name: "06" }, { id: 3, name: "07" }, { id: 3, name: "08" }, { id: 3, name: "09" }, { id: 3, name: "10" }, { id: 3, name: "11" }, { id: 3, name: "12" }]} /></Col>
                      <Col><SelectInput placeholder="YY" options={[{ id: 1, name: "01" }, { id: 2, name: "02" }, { id: 3, name: "03" }, { id: 3, name: "04" }, { id: 3, name: "04" }, { id: 3, name: "05" }, { id: 3, name: "06" }, { id: 3, name: "07" }, { id: 3, name: "08" }, { id: 3, name: "09" }, { id: 3, name: "10" }, { id: 3, name: "11" }, { id: 3, name: "12" }]} /></Col>
                    </Row>
                  </Grid>
                </Col>
                <Col>
                  <label>CCV number</label>
                  <TextInput />
                </Col>
              </Row>
            </Grid>

            <pre> {`<Grid className="form-grid rs-medium-1col">
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
    <Col>
      <label>Long card number</label>
      <TextInput />
    </Col>
    <Col>
      <label>Expiry date</label>
      <Grid className="form-grid">
        <Row>
          <Col><SelectInput placeholder="MM" options={[{ id: 1, name: "01" }, { id: 2, name: "02" }, { id: 3, name: "03" }, { id: 3, name: "04" }, { id: 3, name: "04" }, { id: 3, name: "05" }, { id: 3, name: "06" }, { id: 3, name: "07" }, { id: 3, name: "08" }, { id: 3, name: "09" }, { id: 3, name: "10" }, { id: 3, name: "11" }, { id: 3, name: "12" }]} /></Col>
          <Col><SelectInput placeholder="YY" options={[{ id: 1, name: "01" }, { id: 2, name: "02" }, { id: 3, name: "03" }, { id: 3, name: "04" }, { id: 3, name: "04" }, { id: 3, name: "05" }, { id: 3, name: "06" }, { id: 3, name: "07" }, { id: 3, name: "08" }, { id: 3, name: "09" }, { id: 3, name: "10" }, { id: 3, name: "11" }, { id: 3, name: "12" }]} /></Col>
        </Row>
      </Grid>
    </Col>
    <Col>
      <label>CCV number</label>
      <TextInput />
    </Col>
  </Row>
</Grid>`}</pre>
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
