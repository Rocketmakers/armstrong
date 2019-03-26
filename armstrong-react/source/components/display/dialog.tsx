import * as React from "react";
import * as ReactDOM from "react-dom";
import { useCallback } from "react";
import { Icon } from "./icon";

export interface IDialogProps extends React.HTMLAttributes<HTMLElement> {
  /** (string) The title of the dialog */
  title?: string;
  /** (string) default: '#host' - The selector of the element you'd like to inject the dialog into */
  bodySelector?: string;
  /** (string) An additional class for the dialog layer, normally used for forcing higher z-index values  */
  layerClass?: string;
  /** (boolean) Setting this to true or false will open or close the dialog */
  isOpen: boolean;
  /** (number) The width of the dialog */
  width?: number
  /** (number) The height of the dialog */
  height?: number
  /** (()=> void) Event to fire when the dialog is closed */
  onClose: () => void;
  /** (()=> void) Event to fire when the x button is clicked. Use this to confirm (double dialogs) */
  onXClicked?: () => void;
  /** (boolean) Controls wether the dialog closes when the background overlay is clicked */
  closeOnBackgroundClick?: boolean;
}

export const Dialog : React.FC<IDialogProps> = (props) => {

  const style = { width: props.width || "500px", height: props.height || "auto" }

  const handleBackgroundClick = useCallback(
    e => {
      if (props.closeOnBackgroundClick !== false) {
        const clickedElement = e.target as HTMLElement;
        if (clickedElement && clickedElement.classList.contains("dialog-layer")) {
          props.onClose();
        }
      }
    }, [props.closeOnBackgroundClick]
  )

  const handleXClick = useCallback(
    () => {
      if (props.onXClicked){
        props.onXClicked()
      }else{
        props.onClose();
      }
    }, [props.onXClicked]
  )

  const dialog = (
    <div className={`dialog-layer${props.layerClass ? ` ${props.layerClass}` : ''}`} onClick={handleBackgroundClick}>
      <div className={`dialog${props.className ? ` ${props.className}` : ""}`} style={style} >
        {!props.title &&
          <div className="dialog-close-button-no-title" onClick={handleXClick}>
            <Icon icon={Icon.Icomoon.cross2} />
          </div>
        }
        {props.title &&
          <div className="dialog-header">
            {props.title}
            <div className="dialog-close-button" onClick={handleXClick}>
              <Icon icon={Icon.Icomoon.cross2} />
            </div>
          </div>
        }
        <div className="dialog-content" id="dialog-content">
          {props.children}
        </div>
      </div>
    </div>
  )

  return props.isOpen ? ReactDOM.createPortal(dialog, document.querySelector(props.bodySelector || "#host")) : null
}