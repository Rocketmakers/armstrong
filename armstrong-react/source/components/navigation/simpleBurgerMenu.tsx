import * as React from "react"
import { delay } from "../../utilities/async";
import { Icon } from "../display/icon";
import { Button } from "../interaction/button";

export interface ISimpleBurgerMenuProps {
  content: JSX.Element
  mode?: "push" | "slide"
  onChange?: (state: "open" | "closed") => void
  position?: "left" | "right"
  openButtonIcon: string
  closeButtonIcon: string
  transitionTime?: number
  children: React.ReactNode
  hideOpenButton?: boolean
  hideCloseButton?: boolean
}

const SimpleBurgerMenuComponent: React.FC<ISimpleBurgerMenuProps> = ({
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
  const { open, setOpen, transitioning, setTransitioning } = React.useContext(SimpleBurgerMenuContext)

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
      <nav className="armstrong-simple-burger-menu"
        ref={menuRef}
        data-open={open}
        data-position={position}
        data-mode={mode}
        style={{ transition: `${transitionTime}ms` }}
      >
        {!hideCloseButton && <Button
          className="armstrong-burger-menu-button close"
          onClick={() => setOpen(false)}>
          {closeButtonIcon && <Icon icon={closeButtonIcon} />}
        </Button>
        }
        <div className="armstrong-burger-content">{Content}</div>
      </nav>
      {!hideOpenButton && <Button
        data-position={position}
        className="armstrong-burger-menu-button open"
        onClick={() => setOpen(true)}>
        {openButtonIcon && <Icon icon={openButtonIcon} />}
      </Button>}
      {mode === "slide" && <div
        className="armstrong-menu-overlay"
        onClick={() => setOpen(false)}
        style={{ transition: `${transitionTime}ms` }}
        data-transition={transitioning ? open ? "in" : "out" : open ? "open" : "closed"}
      />}
      <div className="armstrong-site-content-wrapper" style={{ ...slideTransform, transition: `transform ${transitionTime}ms` }}>
        {children}
      </div>
    </>
  )
}

SimpleBurgerMenuComponent.defaultProps = {
  position: "left",
  mode: "slide",
  transitionTime: 300
}

interface ISimpleBurgerMenuContext {
  open: boolean
  setOpen: (open: boolean) => void
  transitioning: boolean
  setTransitioning: (transitioning: boolean) => void
}

export const SimpleBurgerMenuContext = React.createContext<ISimpleBurgerMenuContext>(undefined)

export const SimpleBurgerMenu: React.FC<ISimpleBurgerMenuProps> = props => {
  const [open, setOpen] = React.useState(false)
  const [transitioning, setTransitioning] = React.useState(false)

  return (
    <SimpleBurgerMenuContext.Provider value={{ open, setOpen, transitioning, setTransitioning }}>
      <SimpleBurgerMenuComponent {...props} />
    </SimpleBurgerMenuContext.Provider>
  )
}

export const useSimpleBurgerMenu = () => {

  return React.useContext(SimpleBurgerMenuContext)
}
