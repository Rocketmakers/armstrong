import * as React from "react";
import * as ReactDOM from "react-dom";
import { Icon } from "./icon";

export interface IDialogProps extends React.HTMLAttributes<HTMLElement> {
  /** The title of the dialog */
  title?: string;
  /** The element to use to wrap the title of the dialog */
  headerTagName?: keyof React.ReactHTML;
  /** default: '#host' - The selector of the element you'd like to inject the dialog into */
  bodySelector?: string;
  /** An additional class for the dialog layer, normally used for forcing higher z-index values  */
  layerClass?: string;
  /** Setting this to true or false will open or close the dialog */
  isOpen: boolean;
  /** The width of the dialog */
  width?: number
  /** The height of the dialog */
  height?: number
  /** Event to fire when the dialog is closed */
  onClose: () => void;
  /** Event to fire when the x button is clicked. Use this to confirm (double dialogs) */
  onXClicked?: () => void;
  /**  Controls wether the dialog closes when the background overlay is clicked */
  closeOnBackgroundClick?: boolean;
}

export const Dialog: React.FC<IDialogProps> = props => {
  if (typeof document === "undefined") {
    return null
  }

  const onClose = React.useCallback((reason: DialogLayerCloseReason) => {
    if (reason === "background") {
      if (props.closeOnBackgroundClick !== false) {
        props.onClose();
      }
      return
    }

    if (props.onXClicked) {
      props.onXClicked()
    } else {
      props.onClose();
    }
  }, [props.closeOnBackgroundClick, props.onClose, props.onXClicked])

  const dialog = (
    <DialogLayer title={props.title} layerClass={props.layerClass} className={props.className} width={props.width} height={props.height} onClose={onClose} headerTagName={props.headerTagName}>
      {props.children}
    </DialogLayer>)

  return props.isOpen ? ReactDOM.createPortal(dialog, document.querySelector(props.bodySelector || "#host")) : null
}

type DialogLayerCloseReason = "x-clicked" | "background" | "user"

export interface IDialogLayerPropsCore {
  title?: string
  headerTagName?: keyof React.ReactHTML;
  layerClass?: string
  className?: string
  width?: number
  height?: number
}

export interface IDialogLayerProps extends IDialogLayerPropsCore {
  onClose: (e: DialogLayerCloseReason) => void
}

export const DialogLayer: React.FC<IDialogLayerProps> = ({ title, headerTagName, children, className, height, width, onClose, layerClass }) => {
  const onCloseByBackground = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
    const clickedElement = e.target as HTMLElement;
    if (clickedElement && clickedElement.classList && clickedElement.classList.contains("dialog-layer")) {
      onClose("background");
    }
  }, [onClose])

  const onCloseByX = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
    onClose("x-clicked")
  }, [onClose])

  return (
    <div className={`dialog-layer${layerClass ? ` ${layerClass}` : ""}`} onClick={onCloseByBackground}>
      <DialogPresenter title={title} className={className} width={width} height={height} onClose={onCloseByX} headerTagName={headerTagName}>
        {children}
      </DialogPresenter>
    </div>
  )
}

export interface IDialogPresenterProps {
  title?: string
  headerTagName?: keyof React.ReactHTML;
  className?: string
  width?: number
  height?: number
  onClose: (e: React.MouseEvent<HTMLElement>) => void
}

export const DialogPresenter: React.FC<IDialogPresenterProps> = ({ title, headerTagName, children, className, height, width, onClose }) => {
  const style = React.useMemo(() => ({ width: width || "500px", height: height || "auto" }), [width, height])
  return (
    <div className={`dialog${className ? ` ${className}` : ""}`} style={style} >
      {!title &&
        <div className="dialog-close-button-no-title" onClick={onClose}>
          <Icon icon={Icon.Icomoon.cross2} />
        </div>
      }
      {title &&
        <div className="dialog-header">
          {headerTagName && React.createElement(headerTagName, { children: title })}
          {!headerTagName && title}
          <div className="dialog-close-button" onClick={onClose}>
            <Icon icon={Icon.Icomoon.cross2} />
          </div>
        </div>
      }
      <div className="dialog-content" id="dialog-content">
        {children}
      </div>
    </div>
  )
}

export interface IUseDialogProps {
  onClose: () => void
}

export interface IUseDialogSettings extends IUsePortalSettings, IDialogLayerPropsCore {
  beforeDialogClose?: (reason: DialogLayerCloseReason) => Promise<boolean>
}

export function useDialog(DialogLayerComponent: React.FC<IUseDialogProps>, settings?: IUseDialogSettings) {
  settings = settings || {}
  const { hostElement, initiallyOpen, beforeDialogClose, ...rest } = settings
  return usePortal(p => {
    const onClose = React.useCallback(async (reason: DialogLayerCloseReason) => {
      if (beforeDialogClose) {
        if (await beforeDialogClose(reason)) {
          p.removeFromDOM()
        }
        return
      }
      p.removeFromDOM()
    }, [p.removeFromDOM, beforeDialogClose])
    const onUserClose = React.useCallback(() => onClose("user"), [onClose])
    return (
      <DialogLayer {...rest} onClose={onClose}>
        <DialogLayerComponent onClose={onUserClose} />
      </DialogLayer>
    )
  }, { hostElement, initiallyOpen })
}

export interface IUsePortalSettings {
  hostElement?: string
  initiallyOpen?: boolean
}

interface IPortalState {
  open: boolean
  portal: React.ReactPortal
}

const defaultState: IPortalState = { open: false, portal: null }

export interface IUsePortalProps {
  removeFromDOM: () => void
}

export function usePortal(PortalComponent: React.FC<IUsePortalProps>, settings?: IUsePortalSettings) {
  const portal = React.useMemo(() => {
    if (typeof document === "undefined") {
      return null
    }

    return ReactDOM.createPortal(<PortalComponent removeFromDOM={() => setState(defaultState)} />, document.querySelector(settings && settings.hostElement || "#host"))
  }, [PortalComponent, settings && settings.hostElement])

  const open = React.useCallback(() => {
    setState({ open: true, portal })
  }, [PortalComponent, settings && settings.hostElement])

  const [state, setState] = React.useState<IPortalState>(settings && !!settings.initiallyOpen ? { open: true, portal } : defaultState)

  return {
    open,
    portal: state.portal,
  }
}
