// IMPORTS
import * as React from 'react';
import { Link } from 'react-router';
import * as ReactDOM from 'react-dom';

import { Grid, Row, Col, Button, Icon, TextInput } from 'armstrong-react';

export class Tooltip extends React.Component<{}, {}> {

  navigateTo(path: string) {
    (this.props as any).history.push(path);
  }

  public render() {
    return (

      <Grid>
        <Row>
          <Col>
            <article>
            <h1><Link to="/addons/">Addons:</Link> Tooltip</h1>

            <p>A simple CSS-only tooltip which can be used for form explanation, prototype notes or general UI hints.</p>

            <h2 id="installation">Installation: </h2>

            <p>Visit the <a href="https://github.com/Rocketmakers/armstrong-react-addons" target="_blank">armstrong-react-addons repo</a>, download <code>tooltip.scss</code>, add it to your <code>app/theme/</code> folder and then add the following to your <code>app/theme/theme.scss</code> file:</p>

            <pre className="callout major">
              @import "path/to/tooltip";
            </pre>

            <h2 id="howItWorks">How it works: </h2>

            <p>Add the following where you'd like a tooltip:</p>
            
            <pre>
            {`<span data-tooltip="Your text here" data-tooltip-pos="left">[content]</span>`}
            </pre>

            <h3>Properties</h3>

            <table>
             <thead>
              <tr>
               <th>Property</th>
               <th>description</th>
              </tr>
             </thead>
             <tbody>
              <tr>
               <td>data-tooltip="(string)"</td>
               <td>Enter the text you want to display in the tooltip.</td>
              </tr>
              <tr>
               <td>data-tooltip-pos="up/right/bottom/left"</td>
               <td>Choose where you would like the tooltip to display relative to the cursor.</td>
              </tr>
              <tr>
               <td>[content]</td>
               <td>What content to display for the unhovered state. Use any HTML content.</td>
              </tr>
             </tbody>
            </table>

            <hr />

            <h2 id="examples">Examples: </h2>

            <h3>Basic tooltip</h3>

            <span data-tooltip="Tooltip is working" data-tooltip-pos="right">Hover over me.</span>

            <pre>{`<span data-tooltip="Tooltip is working" data-tooltip-pos="right">Hover over me.</span>`}</pre>

            <hr />

            <h3>Tooltip on a link</h3>

            <span data-tooltip="Tooltip is working" data-tooltip-pos="right"><a href="#">Hover over this link.</a></span>

            <pre>{`<span data-tooltip="Tooltip is working" data-tooltip-pos="right"><a href="#">Hover over this text.</a></span>`}</pre>

            <hr />
            
            <h3>Icon tooltip in a form label</h3>
            
            <Grid className="form-grid">
             <Row>
               <Col>
               <label>Name</label>
               <TextInput />
               </Col>
               <Col>
               <label>Email address <span data-tooltip="So we can check you're a human!" data-tooltip-pos="up"><Icon icon={Icon.Icomoon.question4} /></span></label>
               <TextInput />
               </Col>
             </Row>
            </Grid>
            
            <pre>{`<Grid className="form-grid">
    <Row>
        <Col>
            <label>Name</label>
            <TextInput />
        </Col>
        <Col>
            <label>Email address <span data-tooltip="So we can check you're a human!" data-tooltip-pos="up"><Icon icon={Icon.Icomoon.question4} /></span></label>
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
