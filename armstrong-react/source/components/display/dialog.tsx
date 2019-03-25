import * as React from "react";
import * as ReactDOM from "react-dom";
import { Icon } from "./icon";

export interface IDialogProps {
  /** (string) default: 'host' - The ID of your sites body element  */
  bodyId?: string;
  /** (string) An additional class for the dialog layer, normally used for forcing higher z-index values  */
  layerClass?: string;
  /** (string) CSS classname property */
  className?: string;
  /** (string) The title to use in the dialogs header */
  title?: string;
  /** (boolean) Setting this to true or false will open or close the dialog */
  isOpen: boolean;
  /** (boolean) Controls wether the dialog closes when the background overlay is clicked */
  closeOnBackgroundClick?: boolean;
  /** (()=> void) Event to fire when the dialog is closed */
  onClose: () => void;
  /** (()=> void) Event to fire when the dialog is opened */
  onOpen?: () => void;
  /** (()=> void) Event to fire when the x button is clicked. Use this to confirm (double dialogs) */
  onXClicked?: () => void;
  /** (React.ReactElement<any>) An element, normally containing buttons, to put in the footer */
  footerContent?: React.ReactElement<any>;
  /** (number) The width of the dialog */
  width?: number
  /** (number) The height of the dialog */
  height?: number
}

export class Dialog extends React.Component<IDialogProps, {}> {
  static defaultProps: Partial<IDialogProps> = {
    bodyId: "host",
  };

  private handleBackgroundClick(e: React.MouseEvent<HTMLDivElement>) {
    if (this.props.closeOnBackgroundClick) {
      const clickedElement = e.target as HTMLElement;
      if (clickedElement && clickedElement.classList.contains("dialog-layer")) {
        this.props.onClose();
      }
    }
  }

  private xClicked() {
    if (this.props.onXClicked) {
      this.props.onXClicked();
    } else {
      this.props.onClose();
    }
  }

  private renderDialog() {
    const props = this.props;
    const style = { width: props.width || "500px", height: props.height || "auto" }
    return (
      <div className={`dialog-layer${this.props.layerClass ? ` ${this.props.layerClass}` : ""}`} onClick={e => this.handleBackgroundClick(e)}>
        <div className={`dialog${props.className ? ` ${props.className}` : ""}`} style={style} >
          {!props.title &&
            <div className="dialog-close-button-no-title" onClick={() => this.xClicked()}>
              <Icon icon={Icon.Icomoon.cross} />
            </div>
          }
          {props.title &&
            <div className="dialog-header">
              {props.title}
              <div className="dialog-close-button" onClick={() => this.xClicked()}>
                <Icon icon={Icon.Icomoon.cross} />
              </div>
            </div>
          }
          <div className="dialog-content" id="dialog-content">
            {props.children}
          </div>
          {props.footerContent && <div className="dialog-footer">{props.footerContent}</div>}
        </div>
      </div>
    )
  }

  componentWillReceiveProps(newProps: Readonly<{ children?: React.ReactNode }> & Readonly<IDialogProps>) {
    if (this.props.isOpen !== newProps.isOpen) {
      const main = document.querySelector("main");
      if (!newProps.isOpen) {
        if (main && main.classList.contains("dialog-open")) {
          main.classList.remove("dialog-open");
        }
        this.props.onClose();
      } else {
        if (main && !main.classList.contains("dialog-open")) {
          main.classList.add("dialog-open");
        }
        if (this.props.onOpen) {
          this.props.onOpen();
        }
      }
    }
  }

  render() {
    return this.props.isOpen ? ReactDOM.createPortal(this.renderDialog(), document.getElementById(this.props.bodyId)) : null
  }
}
