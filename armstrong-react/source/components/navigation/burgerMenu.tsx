import * as React from "react"
import { delay } from "../../utilities/async";
import { utils } from "../../utilities/utils";
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
  openButtonIcon?: string
  /** Icon for the close button */
  closeButtonIcon?: string
  /** How long the transition takes in ms */
  transitionTime?: number
  /** Hide the open button, so that you can put a custom button in */
  hideOpenButton?: boolean
  /** Hide the close button, so that you can put a custom button in */
  hideCloseButton?: boolean
  /** Auto closes the burger menu when navigating */
  closeOnNavigate?: boolean
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
  hideCloseButton,
  closeOnNavigate
}) => {
  const { isOpen, setIsOpen, transitioning, setTransitioning } = React.useContext(BurgerMenuContext)

  const [menuWidth, setMenuWidth] = React.useState(0)

  const menuRef = React.useRef<HTMLDivElement>()
  const menuContentRef = React.useRef<HTMLDivElement>()

  React.useEffect(() => {
    if (menuContentRef.current && closeOnNavigate) {
      menuContentRef.current.querySelectorAll("a").forEach(tag => tag.addEventListener("click", close))
    }

    return () => {
      if (menuContentRef.current && closeOnNavigate) {
        menuContentRef.current.querySelectorAll("a").forEach(tag => tag.removeEventListener("click", close))
      }
    }
  }, [menuContentRef])

  const close = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  React.useEffect(() => {
    if (onChange) { onChange(isOpen ? "open" : "closed") }
  }, [isOpen])

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
  }, [isOpen, transitionTime])

  const slideTransform: React.CSSProperties = React.useMemo(() => (mode === "push" ? { transform: isOpen ? `translateX(${position === "left" ? menuWidth : -menuWidth}px)` : `translateX(0)` } : {}), [menuWidth, isOpen, mode])

  return (
    <>
      <nav className="armstrong-menu"
        ref={menuRef}
        data-open={isOpen}
        data-position={position}
        data-mode={mode}
        style={{ transition: `${transitionTime}ms` }}
        role="navigation"
      >
        {!hideCloseButton && <Button
          className="armstrong-menu-button close"
          onClick={() => setIsOpen(false)}
          aria-label="Close the menu"
        >
          {closeButtonIcon && <Icon aria-hidden={true} icon={closeButtonIcon} />}
        </Button>
        }
        <div className="armstrong-burger-content" ref={menuContentRef}>{Content}</div>
      </nav>
      {!hideOpenButton && <Button
        data-position={position}
        className="armstrong-menu-button open"
        onClick={() => setIsOpen(true)}
        aria-label="Open the menu">
        {openButtonIcon && <Icon aria-hidden={true} icon={openButtonIcon} />}
      </Button>}
      {mode === "slide" && <div
        className="armstrong-menu-overlay"
        onClick={() => setIsOpen(false)}
        aria-label="Close the menu"
        aria-hidden={!open}
        style={{ transition: `${transitionTime}ms` }}
        data-transition={transitioning ? isOpen ? "in" : "out" : isOpen ? "open" : "closed"}
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
  transitionTime: 300,
  closeButtonIcon: Icon.Icomoon.cross,
  openButtonIcon: Icon.Icomoon.menu7,
  closeOnNavigate: true
}

interface IBurgerMenuContext {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  transitioning: boolean
  setTransitioning: (transitioning: boolean) => void
  toggle: () => void
  open: () => void
  close: () => void
}

export const BurgerMenuContext = React.createContext<IBurgerMenuContext>(undefined)

export const BurgerMenu: React.FC<IBurgerMenuProps> = props => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [transitioning, setTransitioning] = React.useState(false)

  const toggle = React.useCallback(() => {
    setIsOpen(!isOpen)
  }, [isOpen])
  const open = React.useCallback(() => {
    setIsOpen(true)
  }, [])
  const close = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <BurgerMenuContext.Provider value={{ open, setIsOpen, transitioning, setTransitioning, toggle, isOpen, close }}>
      <BurgerMenuComponent {...props} />
    </BurgerMenuContext.Provider>
  )
}

export const useBurgerMenu = () => {

  const { toggle, transitioning, open, close, isOpen } = React.useContext(BurgerMenuContext)
  return { toggle, transitioning, open, close, isOpen }
}
