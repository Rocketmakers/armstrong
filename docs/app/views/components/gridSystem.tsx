// IMPORTS
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid, Row, Col, Button } from 'armstrong-react';

export class GridSystem extends React.Component<{}, {}> {

  navigateTo(path: string) {
    (this.props as any).history.push(path);
  }

  public render() {
    return (

      <Grid>
        <Row>
          <Col>
            <article>
              <h1>Components: Grid system</h1>

              <p>The grid is at the heart of everything in Armstrong. Layouts, pages and components all make extensive use of the grid. In order to use Armstrong in a production project it's essential that you understand the basic principles of the grid and the three core components; grid, row and col.</p>

              <pre className="callout major">
                {`import { Grid, Row, Col } from 'armstrong-react';`}
              </pre>

              <hr />

              <h2 id="grid">Grid</h2>

              <p>Grid takes the following props specifically, and will also spread additional HTML props to the top level div.</p>

              <pre className="callout minor">
                {`<Grid className='(string)' fillContainer='(boolean)' debugMode='(boolean)' table='(boolean)'/>`}
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
                    <td>className (string)</td>
                    <td>CSS classnames.Works well with armstrongs bg, fg schemes.</td>
                  </tr>
                  <tr>
                    <td>fillContainer (boolean)</td>
                    <td>Makes the grid fill the height and width of its container.Can be useful for fullscreen UI components such as hero banners or sidebars</td>
                  </tr>
                  <tr>
                    <td>debugMode (boolean)</td>
                    <td>Turns on debug mode, allowing you to see the current screen mode and cell rendering.</td>
                  </tr>
                </tbody>
              </table>

              <hr />

              <h2 id="row">Row</h2>

              <p>Row should be used directly inside a grid and takes the following specifically, and will also spread additional HTML props to the top level div.</p>

              <pre className="callout minor">
                {`<Row className='(string)' height='(string|number)' maxCols='(number)' />`}
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
                    <td>className (string)</td>
                    <td>CSS classnames.Works well with armstrongs bg, fg schemes.</td>
                  </tr>
                  <tr>
                    <td>maxCols (number)</td>
                    <td>After this number of cols is hit, they will wrap automatically.</td>
                  </tr>
                  <tr>
                    <td>height (number|boolean)</td>
                    <td>Fixes the rows height. The string "auto" will grow to fit the row's content whereas a number will set an absolute height in pixels.</td>
                  </tr>
                </tbody>
              </table>

              <hr />

              <h2 id="col">Col</h2>

              <p>Col should be used directly inside a row and takes the following props specifically, and will also spread additional HTML props to the top level div.</p>

              <pre className="callout minor">
                {`<Col className='(string)' width='(number|string)' horizontalAlignment='(string)' verticalAlignment='(string)'/>`}
              </pre>

              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Options</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>className (string)</td>
                    <td></td>
                    <td>CSS classnames.Works well with armstrongs bg, fg schemes.</td>
                  </tr>
                  <tr>
                    <td>horizontalAlignment (string|horizontalAlignment)</td>
                    <td>"[left/center/right]""</td>
                    <td>Controls horizontal content alignment.</td>
                  </tr>
                  <tr>
                    <td>verticalAlignment (string|verticalAlignment)</td>
                    <td>"[left/center/right]""</td>
                    <td>Controls vertical content alignment.</td>
                  </tr>
                  <tr>
                    <td>width (number|string)</td>
                    <td>100/'auto'/'2*'</td>
                    <td>Fixes the columns width. A string of "auto" value will grow to fit its content whereas a number will set an absolute width for a column. Star widths (2*, 1*) split by a ratio.</td>
                  </tr>
                </tbody>
              </table>

              <div className="alert bg-negative">Warning: If using either horizontalAlignment or verticalAlignment on a {`<Col />`}with more than one child element then a wrapper div must be used around those elements. See the examples below for more information.</div>


              <hr />



              <h1 id="examples">Examples</h1>

              <h2>Simple grid</h2>

              <Grid className="helper-grid">
                <Row>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 1</Col>
                </Row>
              </Grid>
              <pre>
                {`<Grid>
  <Row>
    <Col>Column 1</Col>
  </Row>
</Grid>`}
              </pre>


              <hr />

              <h2>Star width grid</h2>

              <Grid className="helper-grid">
                <Row>
                  <Col width="1*">Column 1*</Col>
                  <Col width="2*">Column 2*</Col>
                </Row>
              </Grid>
              <pre>
                {`<Grid>
  <Row>
    <Col width="1*">Column 1*</Col>
    <Col width="2*">Column 2*</Col>
  </Row>
</Grid>`}
              </pre>


              <hr />

              <h2>Multi-row grid</h2>


              <Grid className="helper-grid">
                <Row>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 1</Col>
                </Row>
                <Row>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 1</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 2</Col>
                </Row>
                <Row>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 1</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 2</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 3</Col>
                </Row>
                <Row>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 1</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 2</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 3</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 4</Col>
                </Row>
                <Row>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 1</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 2</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 3</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 4</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 5</Col>
                </Row>
              </Grid>

              <pre>
                {`<Grid>
  <Row>
    <Col>Column 1</Col>
  </Row>
  <Row>
    <Col>Column 1</Col>
    <Col>Column 2</Col>
  </Row>
  <Row>
    <Col>Column 1</Col>
    <Col>Column 2</Col>
    <Col>Column 3</Col>
  </Row>
  <Row>
    <Col>Column 1</Col>
    <Col>Column 2</Col>
    <Col>Column 3</Col>
    <Col>Column 4</Col>
  </Row>
  <Row>
    <Col>Column 1</Col>
    <Col>Column 2</Col>
    <Col>Column 3</Col>
    <Col>Column 4</Col>
    <Col>Column 5</Col>
  </Row>
</Grid>`}
              </pre>

              <hr />

              <h2>Mixing fixed width/height and fluid columns</h2>


              <Grid className="helper-grid">
                <Row>
                  <Col width="auto">Auto fixed width</Col>
                  <Col>Fluid</Col>
                  <Col width={100}>Fixed-width 100px</Col>
                  <Col>Fluid</Col>
                </Row>
              </Grid>
              <pre>
                {`<Grid>
  <Row>
    <Col width="auto">Auto fixed width</Col>
    <Col>Fluid</Col>
    <Col width={100}>Fixed-width 100px</Col>
    <Col>Fluid</Col>
  </Row>
</Grid>`}
              </pre>

              <hr />

              <h2>Column Alignment</h2>


              <Grid className="helper-grid">
                <Row height={100}>
                  <Col>No alignment</Col>
                  <Col verticalAlignment="center" horizontalAlignment="center">Center</Col>
                  <Col verticalAlignment="top" horizontalAlignment="right">Top right</Col>
                  <Col verticalAlignment="bottom" horizontalAlignment="left">Bottom left</Col>
                </Row>
              </Grid>
              <pre>
                {`<Grid>
  <Row height={100}>
    <Col>No alignment</Col>
    <Col verticalAlignment="center" horizontalAlignment="center">Center</Col>
    <Col verticalAlignment="top" horizontalAlignment="right">Top right</Col>
    <Col verticalAlignment="bottom" horizontalAlignment="left">Bottom left</Col>
  </Row>
</Grid>`}
              </pre>


              <hr />

              <h2>Using horizontalAlignment and/or verticalAlignment with more than one child element</h2>

              <div className="alert bg-negative">Armstrong targets direct descendant divs for its horizontalAlignment and verticalAlignment properties. If you are looking to use either with more than one child element then you must add an empty {`<div>`}wrapper element which will become the sole target of the centering. See below for an example.</div>


              <Grid className="helper-grid">
                <Row>
                  <Col horizontalAlignment="center" verticalAlignment="center">
                    <div>
                      <Button className="bg-info">Element one</Button>
                      <Button className="bg-info">Element Two</Button>
                    </div>
                  </Col>
                </Row>
              </Grid>
              <pre>
                {`<Grid>
  <Row>
    <Col horizontalAlignment="center" verticalAlignment="center">
      <div>
        <Button className="bg-info">Element One</Button>
        <Button className="bg-info">Element Two</Button>
      </div>
    </Col>
  </Row>
</Grid>`}
              </pre>



              <hr />

              <h2>Debug mode</h2>

              <Grid debugMode={true} className="helper-grid">
                <Row className="p-bottom-small">
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 1</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 2</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 3</Col>
                </Row>
                <Row>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 1</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 2</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 3</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 4</Col>
                </Row>
              </Grid>

              <pre>
                {`<Grid debugMode={true}>
  <Row>
    <Col>Column 1</Col>
    <Col>Column 2</Col>
    <Col>Column 3</Col>
  </Row>
  <Row>
    <Col>Column 1</Col>
    <Col>Column 2</Col>
    <Col>Column 3</Col>
    <Col>Column 4</Col>
  </Row>
</Grid>`}
              </pre>

              <hr />

              <h2>Fixed sidebar with a nested grid using <code>{`fillContainer=true`}</code></h2>


              <Grid debugMode={true} className="helper-grid">
                <Row height={500}>
                  <Col width={100}>
                    <Grid fillContainer={true}>
                      <Row>
                        <Col>Sidebar row 1</Col>
                      </Row>
                      <Row>
                        <Col>Sidebar row 2</Col>
                      </Row>
                    </Grid>
                  </Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Main content</Col>
                </Row>
              </Grid>
              <pre>
                {`<Grid debugMode={true}>
  <Row height={500}>
    <Col width={100}>
      <Grid fillContainer={true}>
        <Row>
          <Col>Sidebar row 1</Col>
        </Row>
        <Row>
          <Col>Sidebar row 2</Col>
        </Row>
      </Grid>
    </Col>
    <Col horizontalAlignment="center" verticalAlignment="center">Main content</Col>
  </Row>
</Grid>`}
              </pre>


            </article>
          </Col>


          <Col className="secondary-nav" width={200}>

            <ul>
              <li><a href="#grid">Grid</a></li>
              <li><a href="#row">Row</a></li>
              <li><a href="#col">Col</a></li>
              <li><a href="#examples">Examples</a></li>
            </ul>

          </Col>

        </Row>
      </Grid>


    );
  }
}
