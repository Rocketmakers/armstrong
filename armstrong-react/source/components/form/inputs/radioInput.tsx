import * as React from "react";
import { ClassHelpers } from "../../../utilities/classHelpers";
import { generateUniqueId } from "../form";
import { DataValidationMessage, DataValidationMode } from "../formCore";

export interface IRadioInput {
  focus: () => void
  blur: () => void
}

export interface IRadioInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelContent: React.ReactNode;
}

const RadioInputRef: React.RefForwardingComponent<IRadioInput, IRadioInputProps> = (props, ref) => {
  const { labelContent, id, ...attrs } = props

  const input = React.useRef<HTMLInputElement>(undefined)

  const refCallback = React.useCallback(() => {
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
    }
  }, [input])

  React.useImperativeHandle(ref, refCallback, [refCallback])

  const validationMessage = DataValidationMessage.get(props)
  const validationMode = DataValidationMode.get(props)

  const autoId = React.useMemo(() => id || generateUniqueId(u => "radio_" + u), [id]);
  const classes = React.useMemo(() => ClassHelpers.classNames(
    "armstrong-input",
    "radio",
    props.className,
    {
      "show-validation": (validationMode !== "none" && validationMessage),
    },
  ), [props.className, validationMode, validationMessage]);

  return (
    <div className={classes} title={validationMessage}>
      <input id={autoId} {...attrs} ref={input} {...DataValidationMessage.spread(validationMessage)} />
      <label htmlFor={autoId} />
      <label className="radio-label" htmlFor={autoId}>{labelContent}</label>
    </div>
  );
}

export const RadioInput = React.forwardRef(RadioInputRef)
