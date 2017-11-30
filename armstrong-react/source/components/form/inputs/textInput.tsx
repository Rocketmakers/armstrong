import * as React from "react";
import { IFormInputHTMLProps } from "../form";
import { Icon } from "./../../display/icon";
import { ValidationLabel } from "../validationWrapper";
import { ClassHelpers } from "../../../utilities/classNames";

export type ITextInputProps = IFormInputHTMLProps<TextInput, React.InputHTMLAttributes<HTMLInputElement> | React.TextareaHTMLAttributes<HTMLTextAreaElement>> & {
  multiLine?: boolean;
  readonly?: boolean;
  rightOverlayText?: string | React.ReactElement<any>;
  leftOverlayText?: string | React.ReactElement<any>;
  type?: string;
  leftIcon?: string;
  rightIcon?: string;
}

export class TextInput extends React.Component<ITextInputProps, {}> {
  static defaultProps = {
    validationMode: "none"
  }
  public input: HTMLInputElement | HTMLTextAreaElement;
  public focus() {
    if (this.input) {
      this.input.focus()
    }
  }
  public blur() {
    if (this.input) {
      this.input.blur()
    }
  }
  render() {
    const validationMessage = this.props["data-validation-message"]
    const { ref, className, readonly, rightOverlayText, leftOverlayText, type, leftIcon, rightIcon, multiLine, validationMode, placeholder, children, ...attrs } = this.props
    var classes = ClassHelpers.classNames(
      "armstrong-input",
      "text-input",
      this.props.className,
      {
        "text-input-disabled": this.props.disabled,
        "has-text-overlay-right": rightOverlayText !== undefined,
        "has-text-overlay-left": leftOverlayText !== undefined,
        "text-input-icon-left": leftIcon !== undefined,
        "text-input-icon-right": rightIcon !== undefined,
        "show-validation": (validationMode !== "none" && validationMessage)
      }
    );
    return (
      <div className={classes} title={validationMessage}>
        {leftIcon && <Icon className="left-icon" icon={leftIcon} />}
        {leftOverlayText && <div className="input-overlay-text-left">{leftOverlayText}</div>}
        {!multiLine && <input  {...attrs as any} ref={r => this.input = r} type={type || "text"} readOnly={readonly} placeholder={placeholder} required={this.props.required} />}
        {multiLine && <textarea  {...attrs as any} ref={r => this.input = r} readOnly={readonly} placeholder={placeholder} />}
        {rightOverlayText && <div className="input-overlay-text-right">{rightOverlayText}</div>}
        {rightIcon && <Icon className="right-icon" icon={rightIcon} />}
        {children}
        <ValidationLabel message={validationMessage} mode={validationMode} />
      </div>
    );
  }
}