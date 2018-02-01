import * as React from "react";
import * as ReactDOM from "react-dom";
import { Icon } from "./icon";
import { Grid, Row, Col } from './../layout/grid';
import { generateUniqueId } from "../form/form";
export interface IDialogProps {
  /** (string) default: 'host' - The ID of your sites body element  */
  bodyId?: string;
  /** (string) An additional class for the dialog layer, normally used for forcing higher z-index values  */
  layerClass?: string;
  /** (string) CSS classname property */
  className?: string;
  /** (string) The title to use in the dialogs header */
  title?: string;
  /** (boolean) Setting this to true or false will open or close the dialog */
  isOpen: boolean;
  /** (boolean) Controls wether the dialog closes when the background overlay is clicked */
  closeOnBackgroundClick?: boolean;
  /** (()=> void) Event to fire when the dialog is closed */
  onClose: () => void;
  /** (()=> void) Event to fire when the dialog is opened */
  onOpen?: () => void;
  /** (()=> void) Event to fire when the x button is clicked. Use this to confirm (double dialogs) */
  onXClicked?: () => void;
  /** (React.ReactElement<any>) An element, normally containing buttons, to put in the footer */
  footerContent?: React.ReactElement<any>;
  /** (number) The width of the dialog */
  width?: number
  /** (number) The height of the dialog */
  height?: number
}

export class Dialog extends React.Component<IDialogProps, {}>{
  private dialogContentElement;

  private appNode: HTMLElement;
  private portalNode: HTMLElement;
  private dialogId: string;

  private closeClicked() {
    this.close();
  }

  private xClicked() {
    if (this.props.onXClicked) {
      this.props.onXClicked();
    } else {
      this.close();
    }
  }

  private close() {
    let main = document.querySelector("main");
    if (main && main.classList.contains("dialog-open")) {
      main.classList.remove("dialog-open");
    }
    this.props.onClose();
    this.unmountPortalNode();
  }

  private scrollToTop() {
    this.dialogContentElement.scrollTop = 0;
  }

  componentDidMount() {
    this.dialogContentElement = document.getElementById("dialog-content");
    this.appNode = document.getElementById(this.props.bodyId || "host");
    if (this.props.isOpen) {
      this.renderToPortal(this.props)
    }
  }

  componentWillReceiveProps(newProps: Readonly<{ children?: React.ReactNode }> & Readonly<IDialogProps>) {
    var open = newProps.isOpen;
    if (open && open != this.props.isOpen && this.props.onOpen) {
      this.props.onOpen();
    }
    if (open) {
      this.renderToPortal(newProps)
    }
    if (!open && this.props.isOpen) {
      if (this.props.onClose) {
        this.props.onClose();
      }
      this.unmountPortalNode();
    }
  }

  private renderToPortal(props: Readonly<{ children?: React.ReactNode }> & Readonly<IDialogProps>) {
    let main = document.querySelector("main");
    if (main && !main.classList.contains("dialog-open")) {
      main.classList.add("dialog-open");
    }
    let element = this.renderDialog(props)
    let node = this.portalNode;

    if (node == null) {
      this.portalNode = node = document.createElement('div');
      this.portalNode.classList.add('dialog-layer');
      if (props.closeOnBackgroundClick) {
        this.portalNode.onclick = (e) => {
          let clickedElement = e.target as HTMLElement;
          if (clickedElement && clickedElement.classList.contains("dialog-layer")) {
            this.close();
          }
        }
      }
      if (props.layerClass) {
        this.portalNode.classList.add(props.layerClass);
      }
      node.id = this.dialogId || generateUniqueId(u => `dialog-layer-${u}`);
      this.appNode.appendChild(node);
    }

    // Renders can return null, but ReactDOM.render() doesn't like being asked
    // to render null. If "element" is `null`, just render a noscript element,
    // like React does when an element's render returns null.
    if (element === null) {
      element = React.createFactory("noscript")();
    }

    // use ReactDOM.unstable_renderSubtreeIntoContainer function instead of
    // render. This allows use to retain "this.context" for the "element"
    ReactDOM.unstable_renderSubtreeIntoContainer(this, element, node);
  }

  componentWillUnmount() {
    this.unmountPortalNode();
  }

  private unmountPortalNode() {
    if (!this.portalNode) {
      return;
    }
    this.portalNode.onclick = null;
    const unmounted = ReactDOM.unmountComponentAtNode(this.portalNode);
    if (unmounted) {
      let body = document.getElementById(this.props.bodyId || "host");
      if (body && this.portalNode) {
        body.removeChild(this.portalNode);
      }
    }
    if (this.portalNode) {
      delete this.portalNode;
    }
    return unmounted;
  }

  private renderDialog(newProps: Readonly<{ children?: React.ReactNode }> & Readonly<IDialogProps>) {
    var style = { width: newProps.width || "500px", height: newProps.height || "auto" }
    return (
      <div className={`dialog${newProps.className ? ` ${newProps.className}` : ''}`} style={style} id={this.dialogId}>
        {!newProps.title &&
          <div className="dialog-close-button-no-title" onClick={() => this.xClicked()}>
            <Icon icon={Icon.Icomoon.cross} />
          </div>
        }
        {newProps.title &&
          <div className="dialog-header">
            {newProps.title}
            <div className="dialog-close-button" onClick={() => this.xClicked()}>
              <Icon icon={Icon.Icomoon.cross} />
            </div>
          </div>
        }
        <div className="dialog-content" id="dialog-content">
          {newProps.children}
        </div>
        {newProps.footerContent && <div className="dialog-footer">{newProps.footerContent}</div>}
      </div>
    )
  }

  render() {
    return (
      <noscript />
    );
  }
}
