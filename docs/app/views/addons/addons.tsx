// IMPORTS
import * as React from 'react';
import { Link } from 'react-router';
import * as ReactDOM from 'react-dom';

import { Grid, Row, Col, TextInput, SelectInput, CalendarInput, Icon, Button } from 'armstrong-react';

export class AddOns extends React.Component<any, {}> {

  navigateTo(path: string) {
    (this.props as any).history.push(path);
  }

  private routeTo(path: string) {
    this.props.history.push(path);
  }

  public render() {
    return (

      <Grid>
        <Row>
          <Col>

            <article>
              <h1>Addons</h1>

              <div className="alert bg-negative">Warning: Addons are not a core part of Armstrong. Future versions of Armstrong may cause breaking changes in these addons.</div>

              <p>See below for a list of addons that have been created at various points during real projects. All addons are optional and provided in plain scss format. Feel free to use as many or as few as you find useful and edit them in any way you see fit on your project.</p>

              <p>You can find the latest versions of all of these addons <a href="https://github.com/Rocketmakers/armstrong-react-addons" target="_blank">on GitHub</a>.</p>

              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><Link to="/addons/formGrid">Form grid</Link></td>
                    <td>Quick styling for forms in grids.</td>
                    <td>0.4.78</td>
                  </tr>
                  <tr>
                    <td><Link to="/addons/formValidation">Form validation</Link></td>
                    <td>Simple validation for Armstrong form elements.</td>
                    <td>0.4.78</td>
                  </tr>
                  <tr>
                    <td><Link to="/addons/responsive">Responsive</Link></td>
                    <td>Breakpoint classes, overrides and tweaks.</td>
                    <td>0.4.78</td>
                  </tr>
                  <tr>
                    <td><Link to="/addons/tableStyling">Table styling</Link></td>
                    <td>Basic styling for table elements.</td>
                    <td>0.4.78</td>
                  </tr>
                  <tr>
                    <td><Link to="/addons/tooltip">Tooltip</Link></td>
                    <td>Simple CSS-only tooltip</td>
                    <td>0.4.78</td>
                  </tr>
                  <tr>
                    <td><Link to="/addons/typography">Typography starter</Link></td>
                    <td>Quick and readable starter styles for standard html elements.</td>
                    <td>0.4.78</td>
                  </tr>
                  <tr>
                    <td>Icomoon definitions</td>
                    <td>Definition required to use Icomoon with the Icon component</td>
                    <td>0.4.85</td>
                  </tr>
                </tbody>
              </table>

<p className="fg-negative f-size-xsmall m-top-small">*If using a version of Armstrong that is not explicitly listed in the table above it is your responsibility to check and test support for any addons.</p>

            </article>

          </Col>




        </Row>
      </Grid >

    );
  }
}
