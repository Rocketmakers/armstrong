import * as React from "react";
import { ClassHelpers } from "../../../utilities/classHelpers";
import { generateUniqueId } from "../form";
import { DataValidationMessage, DataValidationMode } from "../formCore";
import { ValidationLabel } from "../validationWrapper";

export interface ICheckboxInput {
  focus: () => void
  blur: () => void
}

export interface ICheckboxInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelContent: React.ReactNode;
}

const CheckboxInputRef: React.RefForwardingComponent<ICheckboxInput, ICheckboxInputProps> = (props, ref) => {

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

  const { labelContent, id, ...attrs } = props

  const autoId = React.useMemo(() => id || generateUniqueId(u => "checkbox_" + u), [id]);

  const classes = React.useMemo(() => ClassHelpers.classNames(
    "armstrong-input",
    "checkbox",
    props.className,
    {
      "show-validation": (validationMode !== "none" && validationMessage),
    },
  ), [props.className, validationMode, validationMessage]);

  return (
    <div className={classes} title={validationMessage}>
      <input {...attrs} ref={input} id={autoId} type="checkbox" />
      <label htmlFor={autoId} />
      <label className="checkbox-label" htmlFor={autoId}>{labelContent}</label>
      <ValidationLabel message={validationMessage} mode={validationMode} />
    </div>
  )
}

export const CheckboxInput = React.forwardRef(CheckboxInputRef)
