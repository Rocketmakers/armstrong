import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from "underscore";
import { generateUniqueId } from "../form/form";
import { Icon } from "./../display/icon";

export interface IBurgerMenuProps {
  buttonIcon?: string;
  bodyId?: string;
  closeOnNavigate?: boolean;
  burgerButtonHidden?: boolean;
  onMenuToggle?: (sender: BurgerMenu) => any;
  mode?: "push" | "slide";
  /** ID for the burger menu node, avoids auto-generation for isomorphic use. */
  burgerMenuId?: string;
  wrappingComponent?: any;
}

export class BurgerMenu extends React.Component<IBurgerMenuProps, {}> {
  private appNode: HTMLElement;
  private portalNode: HTMLElement;
  private menuId: string;
  isOpen: boolean;

  constructor(props: IBurgerMenuProps) {
    super(props);
    this.menuId = props.burgerMenuId || generateUniqueId(u => `burger-menu-${u}`);
  }
  toggleMenu() {
    if (!this.isOpen) {
      this.openMenu();
    } else {
      this.closeMenu();
    }
  }
  closeMenu() {
    const mode = this.props.mode || "push";
    if (mode === "push") {
      this.appNode.classList.remove("menu-open");
      this.appNode.classList.remove("menu-push");
    } else {
      this.appNode.classList.remove("menu-open");
      this.appNode.classList.remove("menu-slide");
    }
    this.isOpen = false;
    if (this.props.onMenuToggle) {
      this.props.onMenuToggle(this);
    }
  }
  openMenu() {
    const mode = this.props.mode || "push";
    if (mode === "push") {
      this.appNode.classList.add("menu-open");
      this.appNode.classList.add("menu-push");
    } else {
      this.appNode.classList.add("menu-open");
      this.appNode.classList.add("menu-slide");
    }
    this.isOpen = true;
    if (this.props.onMenuToggle) {
      this.props.onMenuToggle(this);
    }
  }

  componentDidMount() {
    const id = this.props.bodyId || "host";
    const appNode = document.getElementById(id);
    this.appNode = appNode;
    if (!appNode) {
      // tslint:disable-next-line:no-console
      console.error(`Cannot find document node of ${id}`);
      return;
    }
  }
  private closeNav(e, handler) {
    // There is a probably a nicer way to do this, but CBA right now
    if (this.props.closeOnNavigate) {
      handler();
    }
  }

  private renderMenu() {
    let wrapper = this.props.wrappingComponent;

    return React.cloneElement(
      wrapper || <></>,
      null,
      <div>
        {this.props.mode === "slide" && <div className="burger-blocker" onClick={() => this.closeMenu()} />}
        <nav className="burger-menu">
          <ul className="burger-menu-list">
            {React.Children.map(this.props.children, (c, index) => {
              return (
                <li onClick={e => this.closeNav(e, () => this.closeMenu())} key={`nav_item_${index}`}>
                  {c}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    );
  }

  render() {
    return (
      <>
        <button className={`burger-menu-button${this.props.burgerButtonHidden ? " hidden" : ""}`} onClick={() => this.toggleMenu()}>
          {this.props.buttonIcon && <Icon icon={this.props.buttonIcon} />}
        </button>
        {ReactDOM.createPortal(this.renderMenu(), document.getElementById(this.props.bodyId || "host"))}
      </>
    );
  }
}

export interface IBurgerMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  icon?: string;
  onClick?: () => void;
  style?: any;
  delayActionMs?: number;
  active?: boolean;
}

export class BurgerMenuItem extends React.Component<IBurgerMenuItemProps, {}> {
  private handleClick(handler) {
    if (this.props.delayActionMs) {
      window.setTimeout(() => {
        handler();
      }, this.props.delayActionMs);
    } else {
      handler();
    }
  }
  render() {
    const { title, icon, onClick, style, delayActionMs, active, ...attrs } = this.props;

    return (
      <div {...attrs} role="menuitem" className={`burger-menu-item${active ? " active" : ""}`} style={style} aria-selected={active || false} onClick={() => (onClick ? this.handleClick(onClick) : null)}>
        {icon && <Icon icon={icon} />}
        {title}
      </div>
    );
  }
}
