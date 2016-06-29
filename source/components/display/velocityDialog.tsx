import * as React from "react";
import * as ReactDOM from "react-dom";
import { VelocityComponent, VelocityTransitionGroup } from 'velocity-react';


export interface IVelocityDialogProps extends React.Props<VelocityDialog> {
  isOpen?: boolean;
}

export interface IVelocityDialogState {
  isOpen?: boolean;
  isRendered?: boolean;
}

export class VelocityDialog extends React.Component<IVelocityDialogProps, IVelocityDialogState> {
  constructor() {
    super();
    this.state = { isOpen: false, isRendered: false }
    this.animationDuration = 500;
  }
  private portalNode: HTMLElement;
  public isOpen: boolean;
  private animationDuration: number;

  createPortal() {
    let node = this.portalNode;

    if (node == null) {
      this.portalNode = node = document.createElement('div');
      this.portalNode.classList.add('dialog-host');
      node.id = "dialog-layer";
      document.body.appendChild(node);
    }
  }

  componentWillMount() {
    this.createPortal();
  }

  componentWillUnmount() {
    this.unmountPortalNode();
  }

  componentWillReceiveProps(newProps: IVelocityDialogProps) {
    console.log(`got props: ${newProps.isOpen ? 'open!' : 'close'}`);
    if (newProps.isOpen !== this.state.isOpen) {
      this.setState({ isOpen: newProps.isOpen, isRendered: newProps.isOpen ? true : this.state.isRendered }, () => {
        this.renderToPortal(this.renderDialog(newProps.children as any[]))
      });
    }
    else {
      this.renderToPortal(this.renderDialog(newProps.children as any[]))
    }
  }

  componentDidMount() {
    this.renderToPortal(this.renderDialog(this.props.children as any[]))
  }

  animationComplete(){
    console.log('complete')
    if (!this.state.isOpen){
      this.setState({ isRendered: false }, ()=>{
        this.renderToPortal(this.renderDialog(this.props.children as any[]))
      })
    }
  }

  renderDialog(children: any[]) {
    return (
      <VelocityComponent duration={this.animationDuration} animation={{ opacity: this.state.isOpen ? 1 : 0 }} complete={this.animationComplete.bind(this)}>
      <div>
        {this.state.isRendered && <div className="dialog-layer">
          <div className="dialog">
            {this.props.children}
          </div>
        </div>}
        {!this.state.isRendered && <noscript/>}
        </div>
      </VelocityComponent>);
  }

  renderToPortal(element) {
    if (element === null) {
      element = React.DOM.noscript();
    }
    ReactDOM.unstable_renderSubtreeIntoContainer(this, element, this.portalNode);
  }

  unmountPortalNode() {
    const unmounted = ReactDOM.unmountComponentAtNode(this.portalNode);
    if (unmounted) {
      document.body.removeChild(this.portalNode);
    }
    delete this.portalNode;
    return unmounted;
  }

  render() {
    return null;
  }
}