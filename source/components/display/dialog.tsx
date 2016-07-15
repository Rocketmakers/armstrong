import * as React from "react";
import * as ReactDOM from "react-dom";
import { Icon } from "./icon";
import { Grid, Row, Col, SingleColumnRow } from './../layout/grid';

export interface IDialogProps extends React.HTMLProps<Dialog> {
  bodyId?: string;
  layerClass?: string;
  title?: string;
  isOpen: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  onXClicked?: () => void;
  footerContent?: JSX.Element;
}

export class Dialog extends React.Component<IDialogProps, {}>{
  private dialogContentElement;

  private appNode: HTMLElement;
  private portalNode: HTMLElement;
  private dialogId: string;

  public closeClicked() {
    if (this.props.onClose) {
      this.props.onClose();
    }
    this.unmountPortalNode();
  }

  public scrollToTop() {
    this.dialogContentElement.scrollTop = 0;
  }

  componentDidMount() {
    this.dialogContentElement = document.getElementById("dialog-content");
    this.appNode = document.getElementById(this.props.bodyId || "host");
    if (this.props.isOpen) {
      this.renderToPortal(this.renderDialog(this.props.children as any[]))
    }
  }

  componentWillReceiveProps(newProps: IDialogProps) {
    var open = newProps.isOpen;
    if (open && open != this.props.isOpen && this.props.onOpen) {
      this.props.onOpen();
    }
    if (open) {
      this.renderToPortal(this.renderDialog(newProps.children as any[]))
    }
    if (!open && this.props.isOpen) {
      if (this.props.onClose) {
        this.props.onClose();
      }
      this.unmountPortalNode();
    }
  }

  renderToPortal(element) {
    //var classes = classNames("dialog-layer", cd("open", this.props.isOpen), this.props.layerClass);
    let node = this.portalNode;

    if (node == null) {
      this.portalNode = node = document.createElement('div');
      this.portalNode.classList.add('dialog-layer');
      if (this.props.layerClass) {
        this.portalNode.classList.add(this.props.layerClass);
      }
      node.id = this.dialogId || `dialog-layer-${Math.random()}`;
      this.appNode.appendChild(node);
    }

    // Renders can return null, but ReactDOM.render() doesn't like being asked
    // to render null. If "element" is `null`, just render a noscript element,
    // like React does when an element's render returns null.
    if (element === null) {
      element = React.DOM.noscript();
    }

    // use ReactDOM.unstable_renderSubtreeIntoContainer function instead of
    // render. This allows use to retain "this.context" for the "element"
    ReactDOM.unstable_renderSubtreeIntoContainer(this, element, node);
  }

  componentWillUnmount() {
    this.unmountPortalNode();
  }

  unmountPortalNode() {
    if (!this.portalNode) {
      return;
    }
    const unmounted = ReactDOM.unmountComponentAtNode(this.portalNode);
    if (unmounted) {
      document.getElementById(this.props.bodyId || "host").removeChild(this.portalNode);
    }
    delete this.portalNode;
    return unmounted;
  }
  renderDialog(children) {
    var style = { width: this.props.width || "500px", height: this.props.height || "auto" }
    return (
      <div className={`dialog${this.props.className ? ` ${this.props.className}` : ''}`} style={style} id={this.dialogId}>
        {this.props.title &&
          <div className="dialog-header">
            {this.props.title}
            <div className="dialog-close-button" onClick={() => this.props.onXClicked ? this.props.onXClicked() : this.closeClicked() }>
              <Icon icon={Icon.Icomoon.cross}/>
            </div>
          </div>
        }
        <div className="dialog-content" id="dialog-content">
          {children}
        </div>
        {this.props.footerContent && <div className="dialog-footer">{this.props.footerContent}</div> }
      </div>
    )
  }

  render() {
    return (
      <noscript/>
    );
  }
}
