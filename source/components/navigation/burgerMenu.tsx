import * as React from "react";
import * as ReactDOM from "react-dom";
import {Icon} from "./../display/icon";

export interface IBurgerMenuProps {
  buttonIcon?: string;
}

export interface IBurgerMenuState {
  menuOpen: boolean;
}

export class BurgerMenu extends React.Component<IBurgerMenuProps, IBurgerMenuState>{
  private navNode;
  private appNode;
  constructor() {
    super();
    this.state = { menuOpen: false };
  }
  toggleMenu() {
    if (!this.state.menuOpen) {
      this.openMenu();
    }
    else {
      this.closeMenu();
    }
  }
  openMenu() {
    this.setState({ menuOpen: true });
    this.appNode.classList.add("menu-open");
  }
  closeMenu() {
    this.setState({ menuOpen: false });
    this.appNode.classList.remove("menu-open");
  }
  componentDidMount() {
    this.appNode = document.getElementById("app-content");
    this.navNode = document.createElement('nav');
    (this.navNode as HTMLElement).id = `burger-menu-${Math.random()}`
    var appContent = document.getElementById("app-content");
    appContent.insertBefore(this.navNode, appContent.firstChild);
    ReactDOM.render(<ul>{(this.props.children as any[]).map(c => <li>{c}</li>) }</ul>, this.navNode);
  }
  render() {
    return (
      <div className="burger-menu-button" onClick={()=> this.toggleMenu()}>B</div>
    )
  }
}