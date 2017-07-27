// IMPORTS
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Grid, Row, Col, Button, Dialog } from 'armstrong-react';

interface IDialogViewState {
  dialogOpen?: boolean;
}

export class DialogView extends React.Component<any, IDialogViewState> {

constructor() {
    super();
    this.state = {
      dialogOpen: false,
    };
  }

  navigateTo(path: string) {
    (this.props as any).history.push(path);
  }

  public render() {
    return (

<div>

      <Grid>
        <Row>
          <Col>
            <article>
            <h1>Components: Dialog</h1>

            <p>A multipurpose dialog, rendered high up into the DOM using subtree rendering to avoid any weird CSS positioning issues.</p>

            <pre className="callout major">
              {`import { Dialog } from 'armstrong-react';`}
            </pre>

            <pre className="callout minor">
                {`<Dialog title='(string)' isOpen='(boolean)' layerClass='(string)' onOpen='(()=> void)' onClose='(()=> void)' onXClicked='(()=> void)'>I am some dialog content</Dialog>`}
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
                    <td>isOpen (string)</td>
                    <td>A boolean for the current visible state of the dialog. Works well with state.</td>
                  </tr>
                  <tr>
                    <td>title (string)</td>
                    <td>The title in the header of the dialog</td>
                  </tr>
                  <tr>
                    <td>layerClass (string)</td>
                    <td>This allows you to layer dialogs (a confirmation for example) by setting a class with a higher z-index</td>
                  </tr>
                  <tr>
                    <td>onOpen (()=> void))</td>
                    <td>onOpen (()=> void))</td>
                  </tr>
                  <tr>
                    <td>onClose (()=> void))</td>
                    <td>Fires when the dialog closes</td>
                  </tr>
                  <tr>
                    <td>onXClicked (()=> void))</td>
                    <td>Fires when the user clicks the 'X' in the topright of the dialog. Useful for confirmations</td>
                  </tr>
                   <tr>
                    <td>footerContent (JSX.Element)</td>
                    <td>Elements here will be stuck to the footer of the dialog. Perfect for action buttons</td>
                  </tr>
                </tbody>
              </table>

 <hr />

            <h1>Examples</h1>

            <h2>Simple dialog</h2>

              <Button onClick={() => this.setState({ dialogOpen: true }) } className="bg-info">Click to open sick dialog</Button>


              <pre>
                {`
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Grid, Row, Col, Dialog, Button } from 'armstrong-react';

interface IYourClassState {
  dialogOpen?: boolean;
}

export class YourClass extends React.Component<any, IYourClassState> {

constructor() {
    super();
    this.state = {
      dialogOpen: false,
    };
  }

  public render() {
    return (
      <div>
        <Button onClick={() => this.setState({ dialogOpen: true }) } className="bg-info">Click to open sick dialog</Button>
        <Dialog title="Sick dialog"
        bodyId="host"
        isOpen={this.state.dialogOpen}
        onClose={() => this.setState({ dialogOpen: false }) }
        footerContent={
          <div>
          <Button className='bg-positive'>Thumbs up!</Button>
          <Button className='bg-negative'>Thumbs down!</Button>
          </div>
        }>
          Wow.
        </Dialog>
      </div>
    );
  }
}


`}
              </pre>

</article>
          </Col>
        </Row>
      </Grid >


<Dialog title="Sick dialog" bodyId="host" isOpen={this.state.dialogOpen} onClose={() => this.setState({ dialogOpen: false }) } footerContent={
          <div>
          <Button className='bg-positive'>Thumbs up!</Button>
          <Button className='bg-negative'>Thumbs down!</Button>
          </div>
        }>
          Wow.
        </Dialog>

</div>

    );
  }
}
