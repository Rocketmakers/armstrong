import * as React from "react";
import { ClassHelpers } from "../../../utilities/classHelpers";
import { DataValidationMessage, DataValidationMode } from "../formCore";
import { ValidationLabel } from "../validationWrapper";
import { Icon } from "./../../display/icon";

export interface ITextInput {
  focus: () => void
  blur: () => void
  select: () => void
}

export type ITextInputProps = (React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> | React.TextareaHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>) & {
  multiLine?: boolean;
  readonly?: boolean;
  rightOverlayText?: React.ReactNode;
  leftOverlayText?: React.ReactNode;
  type?: string;
  leftIcon?: string;
  rightIcon?: string;
  componentDidMount?: (self: ITextInput) => void;
}

const TextInputRef: React.RefForwardingComponent<ITextInput, ITextInputProps> = (props, ref) => {
  const { className, componentDidMount, readonly, rightOverlayText, leftOverlayText, type, leftIcon, rightIcon, multiLine, placeholder, children, ...attrs } = props

  const input = React.useRef<HTMLInputElement | HTMLTextAreaElement>(undefined);
  const refCallback = React.useCallback<() => ITextInput>(() => {
    return {
      focus() {
        if (input.current) {
          input.current.focus()
        }
      },
      blur() {
        if (input.current) {
          input.current.blur()
        }
      },
      select() {
        if (input.current) {
          input.current.select()
        }
      },
    }
  }, [])

  React.useImperativeHandle(ref, refCallback, [refCallback])

  React.useEffect(() => {
    if (componentDidMount) {
      componentDidMount(refCallback());
    }
  }, [componentDidMount, refCallback])

  const validationMessage = DataValidationMessage.get(props)
  const validationMode = DataValidationMode.get(props)

  const classes = React.useMemo(() => ClassHelpers.classNames(
    "armstrong-input",
    "text-input",
    className,
    {
      "text-input-disabled": props.disabled,
      "has-text-overlay-right": rightOverlayText !== undefined,
      "has-text-overlay-left": leftOverlayText !== undefined,
      "text-input-icon-left": leftIcon !== undefined,
      "text-input-icon-right": rightIcon !== undefined,
      "show-validation": (validationMode !== "none" && validationMessage),
    },
  ), [className, props.disabled, rightOverlayText, leftOverlayText, leftIcon, rightIcon, validationMode, validationMessage]);

  return (
    <div className={classes} title={validationMessage}>
      {leftIcon && <Icon className="left-icon" icon={leftIcon} />}
      {leftOverlayText && <div className="input-overlay-text-left">{leftOverlayText}</div>}
      {!multiLine && <input  {...attrs} ref={input as any} type={type || "text"} readOnly={readonly} placeholder={placeholder} required={props.required} />}
      {multiLine && <textarea  {...attrs} ref={input as any} readOnly={readonly} placeholder={placeholder} />}
      {rightOverlayText && <div className="input-overlay-text-right">{rightOverlayText}</div>}
      {rightIcon && <Icon className="right-icon" icon={rightIcon} />}
      {children}
      <ValidationLabel message={validationMessage} mode={validationMode} />
    </div>
  );
}

export const TextInput = React.forwardRef(TextInputRef)
