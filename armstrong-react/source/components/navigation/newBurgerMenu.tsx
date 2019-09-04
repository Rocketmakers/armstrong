import * as React from "react"
import { delay } from "../../utilities/async";
import { Icon } from "../display/icon";
import { Button } from "../interaction/button";
import { utils } from '../../utilities/utils';

interface IBurgerMenuContentProps {
  open: boolean
}

export interface INewBurgerMenuProps {
  collapse?: boolean
  content: JSX.Element | React.FC<IBurgerMenuContentProps>
  mode?: "push" | "slide"
  sticky?: boolean
  onChange?: (state: "open" | "closed") => void
  position?: "left" | "right"
  openButtonIcon: string
  closeButtonIcon: string
  transitionTime?: number
  children: React.ReactNode
}

export interface INewBurgerMenu {
  trigger: () => void
}

const NewBurgerMenuComponent: React.RefForwardingComponent<INewBurgerMenu, INewBurgerMenuProps> = ({
  openButtonIcon,
  closeButtonIcon,
  onChange,
  content: Content,
  position,
  mode,
  transitionTime,
  sticky,
  collapse,
  children
}, ref) => {
  const [open, setOpen] = React.useState(false)
  const [transitioning, setTransitioning] = React.useState(false)
  const [menuWidth, setMenuWidth] = React.useState(0)

  React.useImperativeHandle(ref, () => ({
    trigger: () => {
      setOpen(open)
    }
  }), [open]);

  const menuRef = React.useRef<HTMLDivElement>()

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

  // const bodyStyle: React.CSSProperties = React.useMemo(() => collapse && menuRef.current ? position === "left" ? { paddingLeft: menuRef.current.clientWidth } : { paddingRight: menuRef.current.clientWidth } : {}, [open, collapse, menuRef.current])

  const wow = collapse && menuRef.current ? position === "left" ? { paddingLeft: menuRef.current.clientWidth } : { paddingRight: menuRef.current.clientWidth } : {}

  return (
    <>
      <nav className="armstrong-burger-menu"
        ref={menuRef}
        data-open={open}
        data-sticky={sticky}
        data-position={position}
        data-collapse={collapse}
        style={{ transition: `${transitionTime}ms` }}
      >
        {!collapse &&
          <Button
            className="armstrong-burger-menu-button close"
            onClick={() => setOpen(false)}>
            {closeButtonIcon && <Icon icon={closeButtonIcon} />}
          </Button>}
        {!!collapse &&
          <Button
            className="armstrong-burger-menu-button"
            onClick={() => setOpen(!open)}>
            {closeButtonIcon && <Icon icon={open ? closeButtonIcon : openButtonIcon} />}
          </Button>}
        <div className="armstrong-burger-content">{utils.object.isFunction(Content) ? <Content open={open} /> : Content}</div>
      </nav>
      {!collapse &&
        <Button
          data-position={position}
          className="armstrong-burger-menu-button open"
          onClick={() => setOpen(true)}>
          {openButtonIcon && <Icon icon={openButtonIcon} />}
        </Button>}
      {!collapse && <div
        className="armstrong-menu-overlay"
        onClick={() => setOpen(false)}
        style={{ transition: `${transitionTime}ms` }}
        data-transition={transitioning ? open ? "in" : "out" : open ? "open" : "closed"}
      />
      }
      <div className="armstrong-site-content-wrapper" style={{ ...wow, transition: `padding ${transitionTime}ms` }}>
        {children}
      </div>
    </>
  )
}

export const NewBurgerMenu = React.forwardRef(NewBurgerMenuComponent)

NewBurgerMenu.defaultProps = {
  position: "left",
  mode: "slide",
  transitionTime: 300,
  sticky: false,
  collapse: false
}
