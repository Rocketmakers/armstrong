import * as React from "react";
import { ClassHelpers } from "../../../utilities/classHelpers";
import { generateUniqueId, IFormInputHTMLProps } from "../form";
import { DataValidationMessage } from "../formCore";

export interface ICheckboxInput {
  focus: () => void
  blur: () => void
}

export interface ICheckboxInputProps extends IFormInputHTMLProps<React.InputHTMLAttributes<HTMLInputElement>> {
  labelContent: string | React.ReactElement<any>;
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
  const { validationMode, labelContent, id, ...attrs } = props

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
    <div className={classes}>
      <input {...attrs} ref={input} id={autoId} type="checkbox" />
      <label htmlFor={autoId} />
      <label className="checkbox-label" htmlFor={autoId}>{labelContent}</label>
    </div>
  )
}

export const CheckboxInput = React.forwardRef(CheckboxInputRef)

CheckboxInput.defaultProps = {
  validationMode: "none",
}
