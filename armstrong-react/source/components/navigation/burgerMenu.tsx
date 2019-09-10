import * as React from "react"
import { delay } from "../../utilities/async";
import { Icon } from "../display/icon";
import { Button } from "../interaction/button";

export interface IBurgerMenuProps {
  /** Inner content of the menu */
  content: JSX.Element
  /** Does the menu come in over the top, or push the side */
  mode?: "push" | "slide"
  /** Callback which passes the state of the menu */
  onChange?: (state: "open" | "closed") => void
  /** Position of the menu */
  position?: "left" | "right"
  /** Icon for the open button */
  openButtonIcon: string
  /** Icon for the close button */
  closeButtonIcon: string
  /** How long the transition takes in ms */
  transitionTime?: number
  /** Hide the open button, so that you can put a custom button in */
  hideOpenButton?: boolean
  /** Hide the close button, so that you can put a custom button in */
  hideCloseButton?: boolean
}

const BurgerMenuComponent: React.FC<IBurgerMenuProps> = ({
  openButtonIcon,
  closeButtonIcon,
  onChange,
  content: Content,
  position,
  mode,
  transitionTime,
  children,
  hideOpenButton,
  hideCloseButton
}) => {
  const { open, setOpen, transitioning, setTransitioning } = React.useContext(BurgerMenuContext)

  const [menuWidth, setMenuWidth] = React.useState(0)

  const menuRef = React.useRef<HTMLDivElement>()

  React.useEffect(() => {
    if (onChange) { onChange(open ? "open" : "closed") }

  }, [open])

  React.useEffect(() => {
    if (menuRef.current) {
      setMenuWidth(menuRef.current.clientWidth)
    }
  }, [menuRef])

  const transition = React.useCallback(async () => {
    setTransitioning(true)
    await delay(transitionTime)
    setTransitioning(false)
  }, [setTransitioning, transitionTime])

  React.useEffect(() => {
    transition()
  }, [open, transitionTime])

  const slideTransform: React.CSSProperties = React.useMemo(() => (mode === "push" ? { transform: open ? `translateX(${position === "left" ? menuWidth : -menuWidth}px)` : `translateX(0)` } : {}), [menuWidth, open, mode])
  return (
    <>
      <nav className="armstrong-menu"
        ref={menuRef}
        data-open={open}
        data-position={position}
        data-mode={mode}
        style={{ transition: `${transitionTime}ms` }}
        role="navigation"
      >
        {!hideCloseButton && <Button
          className="armstrong-menu-button close"
          onClick={() => setOpen(false)}
          aria-label="Close the menu"
        >
          {closeButtonIcon && <Icon aria-hidden={true} icon={closeButtonIcon} />}
        </Button>
        }
        <div className="armstrong-burger-content">{Content}</div>
      </nav>
      {!hideOpenButton && <Button
        data-position={position}
        className="armstrong-menu-button open"
        onClick={() => setOpen(true)}
        aria-label="Open the menu">
        {openButtonIcon && <Icon aria-hidden={true} icon={openButtonIcon} />}
      </Button>}
      {mode === "slide" && <div
        className="armstrong-menu-overlay"
        onClick={() => setOpen(false)}
        aria-label="Close the menu"
        aria-hidden={!open}
        style={{ transition: `${transitionTime}ms` }}
        data-transition={transitioning ? open ? "in" : "out" : open ? "open" : "closed"}
      />}
      <div className="armstrong-site-content-wrapper" style={{ ...slideTransform, transition: `transform ${transitionTime}ms` }}>
        {children}
      </div>
    </>
  )
}

BurgerMenuComponent.defaultProps = {
  position: "left",
  mode: "slide",
  transitionTime: 300
}

interface IBurgerMenuContext {
  open: boolean
  setOpen: (open: boolean) => void
  transitioning: boolean
  setTransitioning: (transitioning: boolean) => void
  toggle: () => void
}

export const BurgerMenuContext = React.createContext<IBurgerMenuContext>(undefined)

export const BurgerMenu: React.FC<IBurgerMenuProps> = props => {
  const [open, setOpen] = React.useState(false)
  const [transitioning, setTransitioning] = React.useState(false)

  const toggle = React.useCallback(() => {
    setOpen(!open)
  }, [open])

  return (
    <BurgerMenuContext.Provider value={{ open, setOpen, transitioning, setTransitioning, toggle }}>
      <BurgerMenuComponent {...props} />
    </BurgerMenuContext.Provider>
  )
}

export const useBurgerMenu = () => {

  return React.useContext(BurgerMenuContext)
}
