// IMPORTS
import * as React from 'react';
import { Link } from 'react-router';
import * as ReactDOM from 'react-dom';

import { Grid, Row, Col, Button } from 'armstrong-react';

export class Responsive extends React.Component<{}, {}> {

  navigateTo(path: string) {
    (this.props as any).history.push(path);
  }

  public render() {
    return (

      <Grid>
        <Row>
          <Col>
          <article>
            <h1><Link to="/addons/">Addons:</Link> Responsive</h1>

            <p>By default, Armstrong uses flexbox which will make your columns decrease in size as screen width descreases. For greater control over the responsive behaviour of your site we created an optional extra responsive.scss file which you can add to your project.</p>

            <h2 id="installation">Installation:</h2>

            <p>Visit the <a href="https://github.com/Rocketmakers/armstrong-react-addons" target="_blank">armstrong-react-addons repo</a>, download <code>responsive.scss</code>, add it to your <code>app/theme/</code> folder and then add the following to your <code>app/theme/theme.scss</code> file:</p>
            
            <pre className="callout major">
              @import "path/to/responsive";
            </pre>

            <h2 id="howItWorks">How it works:</h2>

            <p>In Armstrong core it is most common to use the <code>{`<Row />`}</code> component to separate columns out visually. The Armstrong responsive extra instead requires you to place all of your columns in one row, and then use classNames to allow Armstrong to separate the columns into rows for you.</p>

            
            <h2 id="responsiveBreakpoints">Responsive breakpoints</h2>

            <p>To create device agnostic breakpoints we've chosen REM's as the unit for our responsive breakpoints.</p>

            <table>
                <thead>
                  <tr>
                    <th>className</th>
                    <th>Breakpoint default</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>$responsive-xlarge</td>
                    <td>No media query. Enabled by "default"</td>
                  </tr>
                  <tr>
                    <td>$responsive-large</td>
                    <td>@media (max-width: 70rem)</td>
                  </tr>
                  <tr>
                    <td>$responsive-medium</td>
                    <td>@media (max-width: 55rem)</td>
                  </tr>
                  <tr>
                    <td>$responsive-small</td>
                    <td>@media (max-width: 45rem)</td>
                  </tr>
                  <tr>
                    <td>$responsive-xsmall</td>
                    <td>@media (max-width: 35rem)</td>
                  </tr>
                </tbody>
              </table>

            <h2 id="classNames">classNames</h2>

            <p>On it's own our <code>_responsive.scss</code> file does nothing. You will need to apply classes to elements within your DOM in order to see it's effects. Below is a list of classNames you may find useful:</p>

            <table>
                <thead>
                  <tr>
                    <th>className</th>
                    <th>Example</th>
                    <th>Description</th>
                    <th>Restrictions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>rs-SIZE-Xcol</td>
                    <td><code>{`<Row className="rs-large-3col" />`}</code></td>
                    <td>At the breakpoint specified set column</td>
                    <td>Can be added to <code>Grid</code> or <code>Row</code>. Will affect all <code>Col</code> elements within.</td>
                  </tr>
                  <tr>
                    <td>rs-SIZE-unfix</td>
                    <td><code>{`<Col width="auto" className="rs-small-unfix" />`}</code></td>
                    <td>Will override the width="auto" property on a column at a certain breakpoint.</td>
                    <td>Only works on <code>Col</code> elements</td>
                  </tr>
                  <tr>
                    <td>rs-SIZE-full-width</td>
                    <td><code>{`<Button className="rs-xsmall-full-width" />`}</code></td>
                    <td>Will set <code>width: 100%</code></td>
                    <td>Only useful for UI elements within <code>Col</code>. Useful for full width buttons at certain breakpoints.</td>
                  </tr>
                  <tr>
                    <td>rs-SIZE-spaced</td>
                    <td><code>{`<Grid className="rs-xlarge-spaced" />`}</code></td>
                    <td>Will add a small amount of margin at the bottom of all Cols to space out content.</td>
                    <td>Can be added to <code>Grid</code> or <code>Row</code>. Will affect all <code>Col</code> elements within.</td>
                  </tr>
                  <tr>
                    <td>rs-SIZE-hide</td>
                    <td><code>{`<div className="rs-medium-hide" />`}</code></td>
                    <td>Hides content by adding <code>display: none !important</code> to the element at the specified breakpoint.</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>rs-SIZE-show</td>
                    <td><code>{`<div className="rs-medium-show" />`}</code></td>
                    <td>Shows content by adding <code>display: block !important</code> to the element at the specified breakpoint.</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>rs-SIZE-center-content</td>
                    <td><code>{`<div className="rs-medium-center-content" />`}</code></td>
                    <td>Centers almost all content in a div.</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            
            <h2 id="examples">Examples</h2>

            <h3>Simple collapsing columns</h3>

            <p>A simple example showing how you can apply multiple different responsive classNames to. Resize your browser to see the effects. The rs-xlarge-spacing className has also been applied to give spacing to the bottom of each row.</p>
            
            <Grid className="helper-grid">
                <Row className="rs-xlarge-spaced rs-xlarge-4col rs-large-3col rs-medium-2col rs-small-1col">
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 1</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 2</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 3</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 4</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 5</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 6</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 7</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 8</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 9</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 10</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 11</Col>
                  <Col horizontalAlignment="center" verticalAlignment="center">Column 12</Col>
                </Row>
              </Grid>

              <pre>
                {`<Grid>
  <Row className="rs-xlarge-4col rs-large-3col rs-medium-2col rs-small-1col rs-xlarge-spaced ">
    <Col>Column 1</Col>
    <Col>Column 2</Col>
    <Col>Column 3</Col>
    <Col>Column 4</Col>
    <Col>Column 5</Col>
    <Col>Column 6</Col>
    <Col>Column 7</Col>
    <Col>Column 8</Col>
    <Col>Column 9</Col>
    <Col>Column 10</Col>
    <Col>Column 11</Col>
    <Col>Column 12</Col>
  </Row>
</Grid>`}
              </pre>

              <h3>Responsive page header</h3>

              <p>In this example, we use a number of the different responsive properties to create a collapsing UI.</p>

              <Grid className="rs-small-1col rs-small-spaced">
                <Row>
                  <Col verticalAlignment="center" className="p-right-small">
                    <div>
                    <h1 className="f-size-medium m-bottom-none m-top-none">Page Title</h1>
                    <h2 className="f-size-small m-top-xxsmall m-bottom-none">Subtitle here</h2>
                    </div>
                  </Col>
                  <Col verticalAlignment="center" horizontalAlignment="right" width="auto" className="rs-small-unfix">
                    <div className="rs-small-full-width">
                    <Button className="f-size-xsmall bg-positive rs-small-full-width">Create</Button>
                    <Button className="f-size-xsmall bg-negative rs-small-full-width">Delete</Button>
                    </div>
                  </Col>
                </Row>
              </Grid>


              <pre>
                {`<Grid className="rs-small-1col rs-small-spaced">
  <Row>
    <Col verticalAlignment="center">
      <div>
        <h1>Page Title</h1>
        <h2>Subtitle here</h2>
      </div>
    </Col>
    <Col verticalAlignment="center" horizontalAlignment="right" width="auto" className="rs-small-unfix">
      <div className="rs-small-full-width">
        <Button className="bg-positive rs-small-full-width">Create</Button>
        <Button className="bg-negative rs-small-full-width">Delete</Button>
      </div>
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
          <li><a href="#responsiveBreakpoints">Responsive breakpoints</a></li>
          <li><a href="#classNames">classNames</a></li>
          <li><a href="#examples">Examples</a></li>
          </ul>
          
          </Col>
        </Row>
      </Grid>


    );
  }
}
