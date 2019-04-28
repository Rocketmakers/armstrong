import * as React from "react";
import { ClassHelpers } from "../../../utilities/classHelpers";
import { IFormInputHTMLProps } from "../form";
import { DataValidationMessage } from "../formCore";
import { ValidationLabel } from "../validationWrapper";
import { Icon } from "./../../display/icon";

export type ITextInputProps = IFormInputHTMLProps<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> | React.TextareaHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>> & {
  multiLine?: boolean;
  readonly?: boolean;
  rightOverlayText?: string | React.ReactElement<any>;
  leftOverlayText?: string | React.ReactElement<any>;
  type?: string;
  leftIcon?: string;
  rightIcon?: string;
  componentDidMount?: (self: TextInput) => void;
}

export class TextInput extends React.Component<ITextInputProps, {}> {
  static defaultProps: Partial<ITextInputProps> = {
    validationMode: "none",
  }
  input: HTMLInputElement | HTMLTextAreaElement;
  focus() {
    if (this.input) {
      this.input.focus()
    }
  }

  blur() {
    if (this.input) {
      this.input.blur()
    }
  }

  select() {
    if (this.input) {
      this.input.select()
    }
  }

  componentDidMount() {
    if (this.props.componentDidMount) {
      this.props.componentDidMount(this);
    }
  }

  render() {
    const validationMessage = DataValidationMessage.get(this.props)
    const { className, readonly, rightOverlayText, leftOverlayText, type, leftIcon, rightIcon, multiLine, validationMode, placeholder, children, ...attrs } = this.props
    const classes = ClassHelpers.classNames(
      "armstrong-input",
      "text-input",
      this.props.className,
      {
        "text-input-disabled": this.props.disabled,
        "has-text-overlay-right": rightOverlayText !== undefined,
        "has-text-overlay-left": leftOverlayText !== undefined,
        "text-input-icon-left": leftIcon !== undefined,
        "text-input-icon-right": rightIcon !== undefined,
        "show-validation": (validationMode !== "none" && validationMessage),
      },
    );
    return (
      <div className={classes} title={validationMessage}>
        {leftIcon && <Icon className="left-icon" icon={leftIcon} />}
        {leftOverlayText && <div className="input-overlay-text-left">{leftOverlayText}</div>}
        {!multiLine && <input  {...attrs} ref={r => this.input = r} type={type || "text"} readOnly={readonly} placeholder={placeholder} required={this.props.required} />}
        {multiLine && <textarea  {...attrs} ref={r => this.input = r} readOnly={readonly} placeholder={placeholder} />}
        {rightOverlayText && <div className="input-overlay-text-right">{rightOverlayText}</div>}
        {rightIcon && <Icon className="right-icon" icon={rightIcon} />}
        {children}
        <ValidationLabel message={validationMessage} mode={validationMode} />
      </div>
    );
  }
}
