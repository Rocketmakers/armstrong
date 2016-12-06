import * as React from "react";
import { Dialog } from '../../../source/components/display/dialog';
import { Button } from './../../../source/components/interaction/button';

interface ITestProps extends React.Props<Test> {

}

export class Test extends React.Component<ITestProps, { dialogOpen: boolean }> {
  constructor() {
    super();
    this.state = { dialogOpen: false }
  }
  render(){
    return <div>
    <Button onClick={()=> this.setState({ dialogOpen: true })}>Show dialog</Button>
    <Dialog title="waddup!"
    onClose={()=> this.setState({ dialogOpen: false })}
    isOpen={this.state.dialogOpen}>
    [DIALOG CONTENTS START]
    <Button onClick={()=> this.setState({ dialogOpen: false })}>I also close the dialog</Button>
    [DIALOG CONTENTS END]
    </Dialog>
    </div>
  }
}