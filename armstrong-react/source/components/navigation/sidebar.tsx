import * as React from "react";
import { useMedia } from "../../hooks/useMedia";
import { delay } from "../../utilities/async";
import { utils } from "../../utilities/utils";
import { getIconOrJsx, IconOrJsx } from "../display/icon";
import { Button } from "../interaction/button";

interface ISidebarContentProps {
  isOpen: boolean;
}

export interface ISidebarProps {
  /** Is the sidebar initally open */
  openByDefault?: boolean;
  /** Inner content of the sidebar */
  content: JSX.Element | React.FC<ISidebarContentProps>;
  /** Callback which passes the state of the sidebar */
  onChange?: (state: "open" | "closed") => void;
  /** Position of the sidebar */
  position?: "left" | "right";
  /** Icon for the open button */
  openButtonIcon: IconOrJsx;
  /** Icon for the close button */
  closeButtonIcon: IconOrJsx;
  /** How long the transition takes in ms */
  transitionTime?: number;
  /** Sidebar width when open */
  openWidth?: number;
  /** Sidebar width when closed */
  collaspedWidth?: number;
  /** A media query for when the sidebar should auto collapse */
  autoCollapseMediaQuery?: string;
  /** A media query for when the sidebar should turn into a burger menu (mobile) */
  turnToBurgerMediaQuery?: string;
}

const SidebarComponent: React.FC<ISidebarProps & {
  autoCollapse: boolean;
  autoBurger: boolean;
}> = ({
  openButtonIcon,
  closeButtonIcon,
  onChange,
  content: Content,
  position,
  transitionTime,
  children,
  openWidth,
  collaspedWidth,
  autoCollapse,
  autoBurger
}) => {
  const {
    isOpen: open,
    setOpen,
    setTransitioning,
    transitioning,
    close
  } = React.useContext(SidebarContext);

  const sidebarContentRef = React.useRef<HTMLDivElement>();
  React.useEffect(() => {
    if (onChange) {
      onChange(open ? "open" : "closed");
    }
  }, [open]);

  const transition = React.useCallback(async () => {
    setTransitioning(true);
    await delay(transitionTime);
    setTransitioning(false);
  }, [setTransitioning, transitionTime]);

  React.useEffect(() => {
    transition();
  }, [open, transitionTime]);

  React.useEffect(() => {
    if (autoCollapse || autoBurger) {
      setOpen(false);
    }
  }, [autoCollapse, autoBurger]);

  React.useEffect(() => {
    if (sidebarContentRef.current) {
      sidebarContentRef.current
        .querySelectorAll("a")
        .forEach(tag => tag.addEventListener("click", autoClose));
    }

    return () => {
      if (sidebarContentRef.current) {
        sidebarContentRef.current
          .querySelectorAll("a")
          .forEach(tag => tag.removeEventListener("click", autoClose));
      }
    };
  }, [sidebarContentRef, autoCollapse]);

  const autoClose = React.useCallback(() => {
    if (autoCollapse) {
      close();
    }
  }, [autoCollapse]);

  const width = React.useMemo(
    () => (open || autoBurger ? openWidth : collaspedWidth),
    [open, openWidth, collaspedWidth, autoBurger]
  );

  const wrapperStyle = React.useMemo(() => {
    if (!(autoCollapse || autoBurger)) {
      return position === "left"
        ? { paddingLeft: width }
        : { paddingRight: width };
    } else if (autoCollapse && !autoBurger) {
      return position === "left"
        ? { paddingLeft: collaspedWidth }
        : { paddingRight: collaspedWidth };
    } else {
      return {};
    }
  }, [width, autoCollapse, autoBurger, collaspedWidth]);

  return (
    <>
      <nav
        className="armstrong-sidebar"
        data-open={open}
        data-position={position}
        data-burger={autoBurger}
        style={{ transition: `${transitionTime}ms`, width }}
        role="navigation"
      >
        <Button
          className="armstrong-menu-button"
          onClick={() => setOpen(!open)}
          aria-label={`${open ? `Close` : `Open`} the sidebar`}
        >
          {closeButtonIcon &&
            getIconOrJsx(open ? closeButtonIcon : openButtonIcon, {
              "aria-hidden": true
            })}
        </Button>
        <div ref={sidebarContentRef} className="armstrong-burger-content">
          {utils.object.isFunction(Content) ? (
            <Content isOpen={autoBurger ? true : open} />
          ) : (
            Content
          )}
        </div>
      </nav>
      {autoBurger && (
        <Button
          data-position={position}
          className="armstrong-menu-button open"
          onClick={() => setOpen(true)}
          aria-label="Open the sidebar"
        >
          {closeButtonIcon &&
            getIconOrJsx(openButtonIcon, { "aria-hidden": true })}
        </Button>
      )}
      {autoBurger && (
        <div
          className="armstrong-menu-overlay"
          onClick={() => setOpen(false)}
          style={{ transition: `${transitionTime}ms` }}
          data-transition={
            transitioning ? (open ? "in" : "out") : open ? "open" : "closed"
          }
          aria-label="Close the sidebar"
          aria-hidden={!open}
        />
      )}
      <div
        className="armstrong-site-content-wrapper"
        style={{ ...wrapperStyle, transition: `padding ${transitionTime}ms` }}
      >
        {children}
      </div>
    </>
  );
};

export interface ISidebarContext {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  transitioning: boolean;
  setTransitioning: (transitioning: boolean) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const SidebarContext = React.createContext<ISidebarContext>(undefined);

export const Sidebar: React.FC<ISidebarProps> = props => {
  const autoCollapse = useMedia(props.autoCollapseMediaQuery);
  const autoBurger = useMedia(props.turnToBurgerMediaQuery);

  const [isOpen, setIsOpen] = React.useState(
    autoCollapse || autoBurger ? false : props.openByDefault
  );
  const [transitioning, setTransitioning] = React.useState(false);

  const toggle = React.useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  const open = React.useCallback(() => {
    setIsOpen(true);
  }, []);
  const close = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        setOpen: setIsOpen,
        transitioning,
        setTransitioning,
        toggle,
        open,
        close
      }}
    >
      <SidebarComponent
        {...props}
        autoBurger={autoBurger}
        autoCollapse={autoCollapse}
      />
    </SidebarContext.Provider>
  );
};

Sidebar.defaultProps = {
  openByDefault: true,
  position: "left",
  transitionTime: 300,
  openWidth: 250,
  collaspedWidth: 80,
  autoCollapseMediaQuery: "(max-width: 900px)",
  turnToBurgerMediaQuery: "(max-width: 500px)"
};

export const useSidebar = () => {
  const { toggle, transitioning, open, close, isOpen } = React.useContext(
    SidebarContext
  );
  return { toggle, transitioning, open, close, isOpen };
};
