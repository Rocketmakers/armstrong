import * as React from "react";
import * as ReactDOM from "react-dom";
import { Icon } from "./../display/icon";
import { Icons } from "./../../utilities/icons";

export interface IBurgerMenuProps {
  buttonIcon?: string;
  bodyId?: string;
  closeOnNavigate?: boolean;
}

export class BurgerMenu extends React.Component<IBurgerMenuProps, {}>{
  static Icomoon = Icons.Icomoon;
  private appNode: HTMLElement;
  private portalNode: HTMLElement;
  private menuId: string;
  public isOpen: boolean;

  constructor() {
    super();
    this.menuId = `burger-menu${Math.random()}`;
  }
  toggleMenu() {
    if (!this.isOpen) {
      this.openMenu();
    }
    else {
      this.closeMenu();
    }
  }
  closeMenu() {
    this.appNode.classList.remove("menu-open");
    this.isOpen = false;

  }
  openMenu() {
    this.appNode.classList.add("menu-open");
    this.isOpen = true;

  }
  componentWillUnmount() {
    this.unmountPortalNode();
  }

  componentWillReceiveProps(newProps) {

    console.log('will rp');
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
      document.getElementById(this.props.bodyId || "app-content").removeChild(this.portalNode);
    }
    delete this.portalNode;
    return unmounted;
  }

  renderNav(children: any[]) {
    return (
      <ul>{React.Children.map(children, (c, index) => {
        return <li onClick={() => (c as any).props["data-close"] ? this.closeMenu() : null } key={`nav_item_${index}`}>{c}</li>
      })}
      </ul>);
  }

  render() {
    return (
      <button className="burger-menu-button" onClick={() => this.toggleMenu() }>
        { this.props.buttonIcon && <Icon icon={this.props.buttonIcon}/> }
      </button>
    )
  }
}
