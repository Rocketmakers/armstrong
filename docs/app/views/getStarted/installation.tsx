// IMPORTS
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid, Row, Col } from 'armstrong-react';

export class Installation extends React.Component<{}, {}> {

  navigateTo(path: string) {
    (this.props as any).history.push(path);
  }

  public render() {
    return (

      <Grid>
        <Row>
          <Col>
            <article>
            <h1>Get Started: Installation</h1>

            <div className="alert bg-negative">WARNING! This library assumes you're using React, SASS and TypeScript 2.0.x</div>

            <h2 id="gettingStarted">Getting started</h2>

            <h3>Installation</h3>

            <p>Install via <code>npm</code></p>

            <pre>npm i armstrong-react --save</pre>

            <h2 id="importingTheSCSS">Importing the SCSS</h2>

            <p>To make use of the default styles, you'll need to import a two SCSS entry points from the module into your root stylesheet.
            The simplest way of achieving this is to add the following line to your root SCSS file:</p>

            <pre>
            @import "~armstrong-react/dist/imports";<br/>
            @import "~armstrong-react/dist/style";<br/>
            OPTIONAL : @import "~armstrong-react/dist/form";<br/>
            OPTIONAL : @import "~armstrong-react/dist/nav";<br/>
            OPTIONAL : @import "~armstrong-react/dist/responsive";<br/>
            OPTIONAL : @import "~armstrong-react/dist/navigation";
            </pre>

            <div className="alert bg-info">NOTE: If you're not using webpack, you should use an absolute or relative path through your node_modules folder.</div>

            <h2 id="example">Example: Adding a simple Armstrong Button (TypeScript/JSX)</h2>

            <pre>
                {`import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Button } from "armstrong-react";

export class MyComponent extends React.Component<{}, {}> {

  private buttonClicked(e) {
    console.log('Clicked!')
  }

  public render() {
    return (
      <main>
        <h1>Below is a button!</h1>
        <Button className="bg-positive" onClick={ this.buttonClicked }>Armstrong lives!</Button>
      </main>
    );
  }
}`}
              </pre>

              <h2 id="workbenchFolder">Workbench folder</h2>

              <p>Don't worry about this unless you'd like to contribute to armstrong. It's a testbed for writing and testing components. If you want to use it, simple cd into the folder and run </p>
              <pre>npm i</pre>
              <p>then</p>
              <pre>npm start</pre>

              <h2 id="consumedLibraries">Consumed Libraries</h2>

              <ul>
              <li><a target="_blank" href="http://underscorejs.org/">Underscore</a></li>
              <li><a target="_blank" href="https://github.com/JedWatson/classnames">Classnames</a></li>
              </ul>
            </article>

          </Col>


<Col className="secondary-nav" width={200}>
          <ul>
          <li><a href="#gettingStarted">Getting started</a></li>
          <li><a href="#importingTheSCSS">Importing the SCSS</a></li>
          <li><a href="#example">Example: Adding a simple Armstrong Button</a></li>
          <li><a href="#workbenchFolder">Workbench folder</a></li>
          <li><a href="#consumedLibraries">Consumed Libraries</a></li>
          </ul>
          </Col>


        </Row>
      </Grid>


    );
  }
}
