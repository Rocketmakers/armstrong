import * as React from "react";
import * as ReactDOM from "react-dom";
import { Icon } from "./../display/icon";
import { Icons } from "./../../utilities/icons";

export interface IBurgerMenuProps {
  buttonIcon?: string;
  bodyId?: string;
  navClass?: string;
}

export class BurgerMenu extends React.Component<IBurgerMenuProps, {}>{
  static Icomoon = Icons.Icomoon;
  private appNode: HTMLElement;
  private portalNode : HTMLElement;
  private menuId : string;
  public isOpen: boolean;

  constructor() {
    super();
    this.menuId = `burger-menu${Math.random()}`;
  }
  toggleMenu() {
    if (!this.isOpen) {
      this.appNode.classList.add("menu-open");
    }
    else {
      this.appNode.classList.remove("menu-open");
    }
    this.isOpen = !this.isOpen;
  }
  componentWillUnmount() {
    this.unmountPortalNode();
  }

  componentWillReceiveProps(newProps) {
    this.renderToPortal(this.renderNav(newProps.children as any[]))
  }

  componentDidMount() {
    this.appNode = document.getElementById(this.props.bodyId || "app-content");
    this.renderToPortal(this.renderNav(this.props.children as any[]))
  }

  renderToPortal(element) {
    let node = this.portalNode;

    if (node == null) {
      this.portalNode = node = document.createElement('nav');
      this.portalNode.classList.add('burger-menu');
      if(this.props.navClass){
        this.portalNode.classList.add(this.props.navClass);
      }
      node.id = this.menuId;
      this.appNode.insertBefore(node, this.appNode.firstChild);
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

  unmountPortalNode() {
    const unmounted = ReactDOM.unmountComponentAtNode(this.portalNode);
    if (unmounted) {
      document.body.removeChild(this.portalNode);
    }
    delete this.portalNode;
    return unmounted;
  }

  renderNav(children: any[]) {
    return <ul>{children.map((c, index) => <li key={`nav_item_${index}`}>{c}</li>) }</ul>;
  }

  render() {
    return (
      <button className="burger-menu-button" onClick={() => this.toggleMenu() }>
        { this.props.buttonIcon && <Icon icon={this.props.buttonIcon}/> }
      </button>
    )
  }
}
