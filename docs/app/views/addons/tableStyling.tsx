// IMPORTS
import * as React from 'react';
import { Link } from 'react-router';
import * as ReactDOM from 'react-dom';

import { Grid, Row, Col, Button } from 'armstrong-react';

export class TableStyling extends React.Component<{}, {}> {

  navigateTo(path: string) {
    (this.props as any).history.push(path);
  }

  public render() {
    return (

      <Grid>
        <Row>
          <Col>
            <article>
            <h1><Link to="/addons/">Addons:</Link> Table styling</h1>

            <p>The table styling helper adds some nice default styling to <code>{`<table />`}</code> elements.</p>

            <h2 id="installation">Installation: </h2>

            <p>Visit the <a href="https://github.com/Rocketmakers/armstrong-react-addons" target="_blank">armstrong-react-addons repo</a>, download <code>tableStyling.scss</code>, add it to your <code>app/theme/</code> folder and then add the following to your <code>app/theme/theme.scss</code> file:</p>

            <pre className="callout major">
              @import "path/to/tableStyling";
            </pre>

            <h2 id="howItWorks">How it works: </h2>

            <p>Most of the styling will be automatically applied to <code>table</code>, <code>thead</code>, <code>tbody</code>, <code>tfoot</code>, <code>tr</code>, <code>th</code> and <code>td</code> elements.</p>
            <p>An additional class <code>.hoverable</code> can be applied to any <code>{`<table>`}</code> element to provide hoverable row styling to that table.</p>

            <hr />

            <h2 id="examples">Examples: </h2>

            <h3>Table styling</h3>

            <table>
             <thead>
              <tr>
               <th>Item name</th>
               <th>Catalogue number</th>
               <th>Cost</th>
               <th>Actions</th>
              </tr>
             </thead>
             <tbody>
              <tr>
               <td>Desk</td>
               <td>124587125</td>
               <td>100.00</td>
               <td><Button className="bg-info rs-xlarge-full-width">Refresh</Button></td>
              </tr>
              <tr>
               <td>Computer</td>
               <td>58902525</td>
               <td>1500.00</td>
               <td><Button className="bg-info rs-xlarge-full-width">Refresh</Button></td>
              </tr>
              <tr>
               <td>Chair</td>
               <td>5098205</td>
               <td>500.00</td>
               <td><Button className="bg-info rs-xlarge-full-width">Refresh</Button></td>
              </tr>
             </tbody>
             <tfoot>
              <tr>
               <td colSpan={2}>Total</td>
               <td colSpan={2}>2100.00</td>
              </tr>
             </tfoot>
            </table>

            <pre>
            {`<table>
  <thead>
    <tr>
      <th>Item name</th>
      <th>Catalogue number</th>
      <th>Cost</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Desk</td>
      <td>124587125</td>
      <td>100.00</td>
      <td><Button className="bg-info rs-xlarge-full-width">Refresh</Button></td>
    </tr>
    <tr>
      <td>Computer</td>
      <td>58902525</td>
      <td>1500.00</td>
      <td><Button className="bg-info rs-xlarge-full-width">Refresh</Button></td>
    </tr>
    <tr>
      <td>Chair</td>
      <td>5098205</td>
      <td>500.00</td>
      <td><Button className="bg-info rs-xlarge-full-width">Refresh</Button></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colSpan={2}>Total</td>
      <td colSpan={2}>2100.00</td>
    </tr>
  </tfoot>
</table>
              `}
            </pre>
            
            <hr />


            <h3>Hoverable rows</h3>

            <table className="hoverable">
             <thead>
              <tr>
               <th>Item name</th>
               <th>Catalogue number</th>
               <th>Cost</th>
               <th>Actions</th>
              </tr>
             </thead>
             <tbody>
              <tr>
               <td>Desk</td>
               <td>124587125</td>
               <td>100.00</td>
               <td><Button className="bg-info rs-xlarge-full-width">Refresh</Button></td>
              </tr>
              <tr>
               <td>Computer</td>
               <td>58902525</td>
               <td>1500.00</td>
               <td><Button className="bg-info rs-xlarge-full-width">Refresh</Button></td>
              </tr>
              <tr>
               <td>Chair</td>
               <td>5098205</td>
               <td>500.00</td>
               <td><Button className="bg-info rs-xlarge-full-width">Refresh</Button></td>
              </tr>
             </tbody>
             <tfoot>
              <tr>
               <td colSpan={2}>Total</td>
               <td colSpan={2}>2100.00</td>
              </tr>
             </tfoot>
            </table>

            <pre>
            {`<table className="hoverable">
  <thead>
    <tr>
      <th>Item name</th>
      <th>Catalogue number</th>
      <th>Cost</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Desk</td>
      <td>124587125</td>
      <td>100.00</td>
      <td><Button className="bg-info rs-xlarge-full-width">Refresh</Button></td>
    </tr>
    <tr>
      <td>Computer</td>
      <td>58902525</td>
      <td>1500.00</td>
      <td><Button className="bg-info rs-xlarge-full-width">Refresh</Button></td>
    </tr>
    <tr>
      <td>Chair</td>
      <td>5098205</td>
      <td>500.00</td>
      <td><Button className="bg-info rs-xlarge-full-width">Refresh</Button></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colSpan={2}>Total</td>
      <td colSpan={2}>2100.00</td>
    </tr>
  </tfoot>
</table>
              `}
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
