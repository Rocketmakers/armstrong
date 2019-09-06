
import * as React from "react"
import { delay } from "../../utilities/async";
import { utils } from "../../utilities/utils";
import { Icon } from "../display/icon";
import { Button } from "../interaction/button";

interface ISidebarContentProps {
  open: boolean
}

export interface ISidebarProps {
  openByDefault?: boolean
  content: JSX.Element | React.FC<ISidebarContentProps>
  sticky?: boolean
  onChange?: (state: "open" | "closed") => void
  position?: "left" | "right"
  openButtonIcon: string
  closeButtonIcon: string
  transitionTime?: number
  children: React.ReactNode
  openWidth?: number
  collaspedWidth?: number
  autoCollapseMediaQuery?: string
  turnToBurgerMediaQuery?: string
}

const SidebarComponent: React.FC<ISidebarProps & { autoCollapse: boolean, autoBurger: boolean }> = ({
  openByDefault,
  openButtonIcon,
  closeButtonIcon,
  onChange,
  content: Content,
  position,
  transitionTime,
  sticky,
  children,
  openWidth,
  collaspedWidth,
  autoCollapse,
  autoBurger
}) => {
  const { open, setOpen, setTransitioning, transitioning } = React.useContext(SidebarContext)

  React.useEffect(() => {
    if (onChange) { onChange(open ? "open" : "closed") }
  }, [open])

  const transition = React.useCallback(async () => {
    setTransitioning(true)
    await delay(transitionTime)
    setTransitioning(false)
  }, [setTransitioning, transitionTime])

  React.useEffect(() => {
    transition()
  }, [open, transitionTime])

  React.useEffect(() => {
    if (autoCollapse || autoBurger) {
      setOpen(false)
    }
  }, [autoCollapse, autoBurger])

  const width = React.useMemo(() => (open || autoBurger) ? openWidth : collaspedWidth, [open, openWidth, collaspedWidth, autoBurger])

  const wrapperStyle = React.useMemo(() => {
    if (!(autoCollapse || autoBurger)) {
      return position === "left" ? { paddingLeft: width } : { paddingRight: width }
    } else if (autoCollapse && !autoBurger) {
      return position === "left" ? { paddingLeft: collaspedWidth } : { paddingRight: collaspedWidth }
    } else {
      return {}
    }

  }, [width, autoCollapse, autoBurger, collaspedWidth])

  // console.log(autoBurger, autoCollapse)
  return (
    <>
      <nav className="armstrong-collapsable-burger-menu"
        data-open={open}
        data-sticky={sticky}
        data-position={position}
        data-burger={autoBurger}
        style={{ transition: `${transitionTime}ms`, width }}
      >
        <Button
          className="armstrong-burger-menu-button"
          onClick={() => setOpen(!open)}>
          {closeButtonIcon && <Icon icon={open ? closeButtonIcon : openButtonIcon} />}
        </Button>
        <div className="armstrong-burger-content">{utils.object.isFunction(Content) ? <Content open={autoBurger ? true : open} /> : Content}</div>
      </nav>
      {autoBurger && <Button
        className="armstrong-burger-menu-button open"
        onClick={() => setOpen(true)}>
        {closeButtonIcon && <Icon icon={openButtonIcon} />}
      </Button>
      }
      {(autoBurger) && <div
        className="armstrong-menu-overlay"
        onClick={() => setOpen(false)}
        style={{ transition: `${transitionTime}ms` }}
        data-transition={transitioning ? open ? "in" : "out" : open ? "open" : "closed"}
      />}
      <div className="armstrong-site-content-wrapper" style={{ ...wrapperStyle, transition: `padding ${transitionTime}ms` }}>
        {children}
      </div>
    </>
  )
}

export interface ISidebarContext {
  open: boolean
  setOpen: (open: boolean) => void
  transitioning: boolean
  setTransitioning: (transitioning: boolean) => void
}

const SidebarContext = React.createContext<ISidebarContext>(undefined)

export const Sidebar: React.FC<ISidebarProps> = props => {

  const autoCollapse = useMedia(props.autoCollapseMediaQuery)
  const autoBurger = useMedia(props.turnToBurgerMediaQuery)

  const [open, setOpen] = React.useState((autoCollapse || autoBurger) ? false : props.openByDefault)
  const [transitioning, setTransitioning] = React.useState(false)

  return (
    <SidebarContext.Provider value={{ open, setOpen, transitioning, setTransitioning }}>
      <SidebarComponent {...props} autoBurger={autoBurger} autoCollapse={autoCollapse} />
    </SidebarContext.Provider>
  )
}

Sidebar.defaultProps = {
  openByDefault: true,
  position: "left",
  transitionTime: 300,
  sticky: false,
  openWidth: 250,
  collaspedWidth: 80,
  autoCollapseMediaQuery: "(max-width: 900px)",
  turnToBurgerMediaQuery: "(max-width: 500px)",
}

export const useSidebar = () => {
  return React.useContext(SidebarContext)
}

function useMedia(query: string) {
  const [matches, setMatches] = React.useState(window.matchMedia(query).matches);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) { setMatches(media.matches) }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
}