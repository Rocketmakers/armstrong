import * as React from "react";
import * as ReactDOM from "react-dom";
import {classNames, cd} from "./../../utilities/classBuilder";
import { Icon } from "./icon";
import { Grid, Row, Col, SingleColumnRow } from './../layout/grid';
import { VelocityComponent, VelocityTransitionGroup } from 'velocity-react';

export interface IDialogProps extends React.HTMLProps<Dialog> {
  bodyId?: string;
  layerClass?: string;
  title?: string;
  subtitle?: string;
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
    this.appNode = document.getElementById(this.props.bodyId || "app-content");
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
    else {
    }
  }

  renderToPortal(element) {
    //var classes = classNames("dialog-layer", cd("open", this.props.isOpen), this.props.layerClass);
    let node = this.portalNode;

    if (node == null) {
      this.portalNode = node = document.createElement('div');
      this.portalNode.classList.add('dialog-layer');
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
    const unmounted = ReactDOM.unmountComponentAtNode(this.portalNode);
    if (unmounted) {
      document.getElementById(this.props.bodyId || "app-content").removeChild(this.portalNode);
    }
    delete this.portalNode;
    return unmounted;
  }
  renderDialog(children) {
    var style = { width: this.props.width || "500px", height: this.props.height || "auto" }
    return (
      <Grid fillContainer={true}>
        <Row>
          <Col centerContent="both" className="dialog-layout-col">
            <div className="dialog" style={style} role="dialog" aria-hidden={ !this.props.isOpen } aria-labelledby={ this.props.title } aria-describedby={ this.props.subtitle } { ...this.props as any }>
              <Grid fillContainer={true}>
                <Row className={classNames("dialog-header", cd("dialog-header-no-title", !this.props.title)) } fixed={true}>
                  <Col centerContent={{ vertical: "center" }}>
                    {this.props.title &&
                      <div className="flex-override">
                        <div className="dialog-titles">
                          {this.props.title && <div className="dialog-title">{this.props.title}</div>}
                          {this.props.subtitle && <div className="dialog-subtitle">{this.props.subtitle}</div> }
                        </div>
                      </div>
                    }
                  </Col>
                  <Col fixed={true}>
                    <div className="close-dialog-button" onClick={() => this.props.onXClicked ? this.props.onXClicked() : this.closeClicked() }/>
                  </Col>
                </Row>
                <SingleColumnRow id="dialog-content" className="dialog-content">
                  <div>
                    {children}
                  </div>
                </SingleColumnRow>
                <SingleColumnRow className="dialog-footer" fixed={true}>
                  {this.props.footerContent}
                </SingleColumnRow>
              </Grid>
            </div>
          </Col>
        </Row>
      </Grid>)
  }

  render() {
    return (
      <noscript/>
    );
  }
}
