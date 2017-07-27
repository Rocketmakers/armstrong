// IMPORTS
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid, Row, Col } from 'armstrong-react';

export class VariablesAndClasses extends React.Component<{}, {}> {

  navigateTo(path: string) {
    (this.props as any).history.push(path);
  }

  public render() {
    return (

      <Grid>
        <Row>
          <Col>
            <article>
            <h1>Get Started: Variables and Classes</h1>

            <p>Armstrong makes heavy use of variables and classes to produce consistent designs and maintainable sites. See below for a list of all variables that come with Armstrong and classes to allow you to apply them in your styling.</p>

            <div className="alert bg-negative">
            <b>Note:</b> We strongly recommended that you override these variables in your own project SASS rather than edit the original Armstrong variables. 
            </div>


<h2 id="howItWorks">How it works</h2>
<p>You can consume these variables in a number of ways. It{`'`}s up to you how you choose to use them:</p>
<ul>
<li>Using the class inline e.g. <code>{`<h1 className="f-size-large">Heading</div>`}</code>.</li> 
<li>Using the variable name in your scss file e.g. <code>h1 {`{font-size: $font-size-large}`}</code>.</li>
<li>Using sass extend e.g. <code>h1 {`{font-size: extend %f-size-large}`}</code>.</li>
</ul>

<hr />


<h2 id="inlineOrStyleSheet">Inline or stylesheet?</h2>
<p>Rather than enforce one way of doing things we have kept the choice open so you can make the best decision for your project. For instance when prototyping or designing in the browser inline classes can produce rapid results. Inline styling can also be useful in production code, however, where it has been used to escape semantic class naming (e.g. .sidebar-link) and increase readibility/maintainability for large teams. Using stylesheets can help with better compartmentalising of React components. Ultimately, it's up to you to decide what's best for your workflow and your project. We frequently use the two together with good results.</p>


<hr />

<h2 id="pageSize">Page size</h2>

<p>A single variable to bring consistency to full page content containers.</p>

<div className="alert bg-negative">Where possible try to use the className ".width-wrapper" located in Armstrong's _helpers.scss for content containers. This will create cross-project UI consistency which will be important for re-use if we decide to go down that route.</div>

<table>
 <thead>
  <tr>
   <th>Variable name</th>
   <th>className</th>
   <th>Default value</th>
   <th>Description</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td>$fixed-site-width</td>
   <td>width-wrapper</td>
   <td>960px</td>
   <td>max-width: $fixed-site-width; margin: 0 auto;</td>
  </tr>
 </tbody>
</table>

<hr />

<h2 id="fontSizing">Font sizing</h2>

<p>We{`'`}ve chosen REM{`'`}s as the unit for Armstrong font sizes in an attempt to provide a device-agnostic typographic system better suited to responsive, multi-screen user experience. Rem{`'`}s are "root em{`'`}s". This means that 1rem equals the font size of the html element (which for most browsers has a default value of 16px). The difference between using em{`'`}s and rem{`'`}s is that em{`'`}s are relative to the font-size of any parent element(s) which can result cause all sorts of cascading. Rem{`'`}s are only relative to the root font-size, allowing for a more consistent, more readable font size appearance across different devices.</p>

<pre className="callout minor">
                {`<h1 className="f-size-small">Hello</h1>`}
              </pre>

<table>
 <thead>
  <tr>
   <th>Variable name</th>
   <th>className</th>
   <th>Default value</th>
   <th>Description</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td>$font-size-root</td>
   <td>Not used</td>
   <td>16px</td>
   <td>Only used as root value for variable rem sizing.</td>
  </tr>
  <tr>
   <td>$font-size-xxsmall</td>
   <td>f-size-xxsmall</td>
   <td>0.6rem</td>
   <td>The smallest font size available by default.</td>
  </tr>
  <tr>
   <td>$font-size-xsmall</td>
   <td>f-size-xsmall</td>
   <td>0.8rem</td>
   <td></td>
  </tr>
  <tr>
   <td>$font-size-small</td>
   <td>f-size-small</td>
   <td>1rem</td>
   <td></td>
  </tr>
  <tr>
   <td>$font-size-medium</td>
   <td>f-size-medium</td>
   <td>1.2rem</td>
   <td></td>
  </tr>
  <tr>
   <td>$font-size-large</td>
   <td>f-size-large</td>
   <td>1.5rem</td>
   <td></td>
  </tr>
  <tr>
   <td>$font-size-xlarge</td>
   <td>f-size-xlarge</td>
   <td>2rem</td>
   <td>The largest font size available by default.</td>
  </tr>
 </tbody>
</table>

<hr />

<h2 id="spacing">Spacing (margins and padding)</h2>

<p>To increase consistency and speed of our web development we chose to bring all of our margin and paddings together into variables, again using rem{`'`}s to provide a more consistency and flexible experience across devices. Spacing requires a size and direction modifier.</p> 

<pre className="callout minor">
                {`<div className="m-top-none p-large" />`}
              </pre>

<h3>Size modifiers</h3>

<table>
 <thead>
  <tr>
   <th>Variable name</th>
   <th>padding className</th>
   <th>margin className</th>
   <th>Default value</th>
   <th>Description</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td>$spacing-xxsmall</td>
   <td>p-xxsmall</td>
   <td>m-xxsmall</td>
   <td>0.25rem</td>
   <td></td>
  </tr>
  <tr>
   <td>$spacing-xsmall</td>
   <td>p-xsmall</td>
   <td>m-xsmall</td>
   <td>0.5rem</td>
   <td></td>
  </tr>
  <tr>
   <td>$spacing-small</td>
   <td>p-small</td>
   <td>m-small</td>
   <td>1rem</td>
   <td></td>
  </tr>
  <tr>
   <td>$spacing-medium</td>
   <td>p-medium</td>
   <td>m-medium</td>
   <td>2rem</td>
   <td></td>
  </tr>
  <tr>
   <td>$spacing-large</td>
   <td>p-large</td>
   <td>m-large</td>
   <td>3rem</td>
   <td></td>
  </tr>
  <tr>
   <td>$spacing-xlarge</td>
   <td>p-xlarge</td>
   <td>m-xlarge</td>
   <td>4rem</td>
   <td></td>
  </tr>
  <tr>
   <td>No spacing</td>
   <td>p-none</td>
   <td>m-none</td>
   <td>0</td>
   <td>Used to override and remove spacing on elements</td>
  </tr>
 </tbody>
</table>

<h3>Spacing modifiers</h3>

<p>By default using the size modifiers as listed above will apply padding/margins to all directions (top, right, bottom, left) however Armstrong variables give you the flexibility to apply spacing variables to those directions individually, too. See how to use this below:</p>

<div className="alert bg-info">
            <b>Note:</b> In the table below we've used the <em>xlarge</em> font size modifier as an example. Replace this with your own sizing. 
            </div>

<table>
 <thead>
  <tr>
   <th>Direction</th>
   <th>padding className</th>
   <th>margin className</th>
   <th>Description</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td>All directions</td>
   <td>p-xlarge</td>
   <td>m-xlarge</td>
   <td>Spacing to top, right, bottom and left.</td>
  </tr>
  <tr>
   <td>Top</td>
   <td>p-top-xlarge</td>
   <td>m-top-xlarge</td>
   <td></td>
  </tr>
  <tr>
   <td>Right</td>
   <td>p-right-xlarge</td>
   <td>m-right-xlarge</td>
   <td></td>
  </tr>
  <tr>
   <td>Bottom</td>
   <td>p-bottom-xlarge</td>
   <td>m-bottom-xlarge</td>
   <td></td>
  </tr>
  <tr>
   <td>Left</td>
   <td>p-left-xlarge</td>
   <td>m-left-xlarge</td>
   <td></td>
  </tr>
 </tbody>
</table>


<hr />


<h2 id="colours">Colours</h2>

<p>Armstrong comes with a set of colour variables so you can produce nice looking sites and apps quickly. When referencing the colour as a className you must choose whether to apply the fg- or bg- prefix to style either the foreground (e.g. text color) or background (background-color) on an element.</p>

<div className="alert bg-positive">We actively encourage you to add your own values instead of using the default variables here!</div>

<table>
 <thead>
  <tr>
   <th></th>
   <th>Variable name</th>
   <th>foreground color className</th>
   <th>background color className</th>
   <th>Default value</th>
   <th>Description</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td><div className="swatch bg-white" /></td>
   <td>$white</td>
   <td>fg-white</td>
   <td>bg-white</td>
   <td>#ffffff</td>
   <td>Variable is required for fg-white and bg-white classNames.</td>
  </tr>
  <tr>
   <td><div className="swatch bg-gray-medium" /></td>
   <td>$gray-base</td>
   <td>Not used</td>
   <td>Not used</td>
   <td>#4f5c69</td>
   <td>This is the baseline colour by which the other default colours are calculated.</td>
  </tr>
  <tr>
   <td><div className="swatch bg-gray-very-dark" /></td>
   <td>$gray-very-dark</td>
   <td>fg-gray-very-dark</td>
   <td>bg-gray-very-dark</td>
   <td>darken($gray-base, 20%)</td>
   <td></td>
  </tr>
  <tr>
   <td><div className="swatch bg-gray-dark" /></td>
   <td>$gray-dark</td>
   <td>fg-gray-dark</td>
   <td>bg-gray-dark</td>
   <td>darken($gray-base, 15%)</td>
   <td></td>
  </tr>
  <tr>
   <td><div className="swatch bg-gray-medium" /></td>
   <td>$gray-very-medium</td>
   <td>fg-gray-very-medium</td>
   <td>bg-gray-very-medium</td>
   <td>$gray-base</td>
   <td></td>
  </tr>
  <tr>
   <td><div className="swatch bg-gray-light" /></td>
   <td>$gray-light</td>
   <td>fg-gray-light</td>
   <td>bg-gray-light</td>
   <td>lighten($gray-base, 50%)</td>
   <td></td>
  </tr>
  <tr>
   <td><div className="swatch bg-gray-very-light" /></td>
   <td>$gray-very-light</td>
   <td>fg-gray-very-light</td>
   <td>bg-gray-very-light</td>
   <td>lighten($gray-base, 60%)</td>
   <td></td>
  </tr>
  <tr>
   <td><div className="swatch bg-positive" /></td>
   <td>$color-positive</td>
   <td>fg-positive</td>
   <td>bg-negative</td>
   <td>#00a388</td>
   <td>Used for positive UI states</td>
  </tr>
  <tr>
   <td><div className="swatch bg-warning" /></td>
   <td>$color-warning</td>
   <td>fg-warning</td>
   <td>bg-warning</td>
   <td>#f78e52</td>
   <td>Used for warning UI states</td>
  </tr>
  <tr>
   <td><div className="swatch bg-negative" /></td>
   <td>$color-negative</td>
   <td>fg-negative</td>
   <td>bg-negative</td>
   <td>#df5a49</td>
   <td>Used for negative UI states</td>
  </tr>
  <tr>
   <td><div className="swatch bg-info" /></td>
   <td>$color-info</td>
   <td>fg-info</td>
   <td>bg-info</td>
   <td>#3498d8</td>
   <td>Used for generic UI states</td>
  </tr>
 </tbody>
</table>


<hr />

<h2 id="textAlignment">Text alignment</h2>
<p>Use these classes inline as a shorthand for the text-align property.</p>

<table>
 <thead>
  <tr>
   <th>Class name</th>
   <th>Description</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td>t-align-left</td>
   <td>Left alignment</td>
  </tr>
  <tr>
   <td>t-align-center</td>
   <td>Center alignment</td>
  </tr>
  <tr>
   <td>t-align-right</td>
   <td>Right alignment</td>
  </tr>
 </tbody>
</table>

<hr />


<h2 id="formVariables">Form variables</h2>
<p>These variables are used for the form generation in Armstrong. We've picked the numbers to give you good looking, modern forms but feel free to override them in your own SASS. Since the goal of these variables is to produce consistent looking forms we haven't generated classes for any of them.</p>

<table>
 <thead>
  <tr>
   <th>Variable name</th>
   <th>Default value</th>
   <th>Description</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td>$corner-radius-small</td>
   <td>5px</td>
   <td>Used for smaller rounded edges on form elements like text inputs.</td>
  </tr>
  <tr>
   <td>$corner-radius-small</td>
   <td>15px</td>
   <td>Used for larger rounded edges on form elements like radio and checkboxes.</td>
  </tr>
  <tr>
   <td>$form-field-height</td>
   <td>40px</td>
   <td>Used to set the height of form fields.</td>
  </tr>
 </tbody>
</table>
</article>
          </Col>
          
          <Col className="secondary-nav" width={200}>
          <ul>
          <li><a href="#howItWorks">How it works</a></li>
          <li><a href="#pageSize">Page size</a></li>
          <li><a href="#inlineOrStyleSheet">Inline or stylesheet?</a></li>
          <li><a href="#fontSizing">Font sizing</a></li>
          <li><a href="#spacing">Spacing (margins and padding)</a></li>
          <li><a href="#colours">Colours</a></li>
          <li><a href="#textAlignment">Text alignment</a></li>
          <li><a href="#formVariables">Form variables</a></li>
          </ul>
          </Col>
          
        </Row>
      </Grid>


    );
  }
}
