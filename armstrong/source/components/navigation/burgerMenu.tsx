import * as React from "react";
import * as ReactDOM from "react-dom";
import { Icon } from "./../display/icon";
import { Icons } from "./../../utilities/icons";

export interface IBurgerMenuProps {
  buttonIcon?: string;
  bodyId?: string;
  closeOnNavigate?: boolean;
  burgerButtonHidden?: boolean;
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
  closeNav(e, handler) {
    // There is a probably a nicer way to do this, but CBA right now
    if (this.props.closeOnNavigate) {
      handler()
    }
  }

  renderNav(children: any[]) {
    return (
      <ul className="burger-menu-list" role="menu" aria-activedescendant aria-expanded={ this.isOpen } aria-hidden={ !this.isOpen }>{React.Children.map(children, (c, index) => {
        return <li onClick={(e) => this.closeNav(e, () => this.closeMenu()) } key={`nav_item_${index}`}>{c}</li>
      }) }
      </ul>);
  }

  render() {
    return (
      <button className={`burger-menu-button${this.props.burgerButtonHidden ? " hidden" : ""}`} onClick={() => this.toggleMenu() }>
        { this.props.buttonIcon && <Icon icon={this.props.buttonIcon}/> }
      </button>
    )
  }
}


export interface IBurgerMenuItemProps extends React.Props<BurgerMenuItem> {
  title: string;
  icon?: string;
  onClick?: () => void;
  style?: any;
  delayActionMs?: number;
  active?: boolean;
}

export class BurgerMenuItem extends React.Component<IBurgerMenuItemProps, {}> {
  handleClick(handler) {
    if (this.props.delayActionMs) {
      window.setTimeout(() => {
        handler()
      }, this.props.delayActionMs)
    } else {
      handler()
    }
  }
  render() {
    return <div role="menuitem" className={`burger-menu-item${this.props.active ? ' active' : ''}`} style={this.props.style} aria-selected={ this.props.active || false } onClick={() => this.props.onClick ? this.handleClick(this.props.onClick) : null }>
      {this.props.icon && <Icon icon={this.props.icon}/>}{this.props.title}
    </div>
  }
}
