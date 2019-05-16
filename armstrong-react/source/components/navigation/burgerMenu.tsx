import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from "underscore";
import { Icon } from "./../display/icon";

export interface IBurgerMenu {
  toggleMenu: () => void
  closeMenu: () => void
  openMenu: () => void
  isOpen: boolean
}

export interface IBurgerMenuProps {
  buttonIcon?: string;
  bodySelector?: string;
  closeOnNavigate?: boolean;
  burgerButtonHidden?: boolean;
  onMenuToggle?: (sender: IBurgerMenu) => any;
  mode?: "push" | "slide";
  wrappingComponent?: React.ReactElement;
  children?: React.ReactElement<IBurgerMenuItemProps> | Array<React.ReactElement<IBurgerMenuItemProps>>
}

const BurgerMenuRef: React.RefForwardingComponent<IBurgerMenu, IBurgerMenuProps> = (props, ref) => {
  const { bodySelector, burgerButtonHidden, buttonIcon, closeOnNavigate, mode, onMenuToggle, wrappingComponent, children } = props
  let appNode: HTMLElement;
  const isOpen = React.useRef(false);

  React.useEffect(() => {
    const selector = bodySelector || "#host";
    appNode = document.querySelector(selector);
    if (!appNode) {
      // tslint:disable-next-line:no-console
      console.error(`Cannot find document node of ${selector}`);
    }
  }, [bodySelector])

  const closeMenu = React.useCallback(() => {
    const mode1 = mode || "push";
    if (mode1 === "push") {
      appNode.classList.remove("menu-open");
      appNode.classList.remove("menu-push");
    } else {
      appNode.classList.remove("menu-open");
      appNode.classList.remove("menu-slide");
    }
    isOpen.current = false;
    if (onMenuToggle) {
      onMenuToggle(burgerMenu());
    }
  }, [mode, onMenuToggle, appNode])

  const openMenu = React.useCallback(() => {
    const mode1 = mode || "push";
    if (mode1 === "push") {
      appNode.classList.add("menu-open");
      appNode.classList.add("menu-push");
    } else {
      appNode.classList.add("menu-open");
      appNode.classList.add("menu-slide");
    }
    isOpen.current = true;
    if (onMenuToggle) {
      onMenuToggle(burgerMenu());
    }
  }, [mode, onMenuToggle, appNode])

  const toggleMenu = React.useCallback(() => {
    if (!isOpen.current) {
      openMenu();
    } else {
      closeMenu();
    }
  }, [openMenu, closeMenu])

  const closeNav = React.useCallback(() => {
    if (closeOnNavigate) {
      closeMenu();
    }
  }, [closeOnNavigate, closeMenu])

  const renderMenu = React.useCallback(() => {
    return React.cloneElement(
      wrappingComponent || <></>,
      null,
      <div>
        {mode === "slide" && <div className="burger-blocker" onClick={closeMenu} />}
        <nav className="burger-menu">
          <ul className="burger-menu-list">
            {React.Children.map(children, (c, index) => {
              return (
                <li onClick={closeNav} key={`nav_item_${index}`}>
                  {c}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>,
    );
  }, [mode, children, closeMenu, wrappingComponent])

  const burgerMenu = React.useCallback<() => IBurgerMenu>(() => {
    return {
      openMenu,
      closeMenu,
      toggleMenu,
      isOpen: isOpen.current,
    }
  }, [openMenu, closeMenu, toggleMenu, isOpen])

  React.useImperativeHandle(ref, burgerMenu, [burgerMenu])

  return (
    <>
      <button className={`burger-menu-button${burgerButtonHidden ? " hidden" : ""}`} onClick={toggleMenu}>
        {buttonIcon && <Icon icon={buttonIcon} />}
      </button>
      {ReactDOM.createPortal(renderMenu(), document.querySelector(bodySelector || "#host"))}
    </>
  );
}

export const BurgerMenu = React.forwardRef(BurgerMenuRef)

export interface IBurgerMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  icon?: string;
  onClick?: () => void;
  style?: any;
  delayActionMs?: number;
  active?: boolean;
}

export const BurgerMenuItem: React.FC<IBurgerMenuItemProps> = props => {
  const { title, icon, onClick, style, delayActionMs, active, ...attrs } = props;
  const handleClick = React.useCallback(() => {
    if (!onClick) {
      return
    }
    if (delayActionMs) {
      window.setTimeout(() => {
        onClick();
      }, delayActionMs);
    } else {
      onClick();
    }
  }, [onClick, delayActionMs])

  return (
    <div {...attrs} role="menuitem" className={`burger-menu-item${active ? " active" : ""}`} style={style} aria-selected={active || false} onClick={handleClick}>
      {icon && <Icon icon={icon} />}
      {title}
    </div>
  );
}
