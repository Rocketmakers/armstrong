import * as React from "react";
import { ClassHelpers } from "../../../utilities/classHelpers";
import { generateUniqueId } from "../form";
import { DataValidationMessage, DataValidationMode } from "../formCore";
import { ValidationLabel } from "../validationWrapper";

export interface IRadioListInput {
  focus: () => void
  blur: () => void
}

export interface IRadioListInputOption {
  labelContent: React.ReactNode;
  value: string
}

export interface IRadioListInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  options: IRadioListInputOption[]
}

const RadioListInputRef: React.RefForwardingComponent<IRadioListInput, IRadioListInputProps> = (props, ref) => {
  const { options, id, value, ...attrs } = props

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

  const classes = React.useMemo(() => ClassHelpers.classNames(
    "armstrong-input",
    "radio-list",
    props.className,
    {
      "show-validation": (validationMode !== "none" && validationMessage),
    },
  ), [props.className, validationMode, validationMessage]);

  const autoId = React.useMemo(() => id || generateUniqueId(u => "radio_" + u), [id]);
  return (
    <div className={classes} title={validationMessage}>
      {options && options.map((o, i) => <RadioOption autoId={`${autoId}_${i}`} key={o.value} input={i === 0 ? input : undefined} checked={value === o.value} value={o.value} labelContent={o.labelContent} {...attrs} />)}
      <ValidationLabel message={validationMessage} mode={validationMode} />
    </div>
  );
}

const RadioOption: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { autoId: string, labelContent: React.ReactNode, input: React.MutableRefObject<HTMLInputElement> }> = p => {
  const { input, labelContent, autoId, ...attrs } = p
  return (
    <div className="radio-option">
      <input {...attrs} id={autoId} ref={input} />
      <label htmlFor={autoId} />
      <label className="radio-label" htmlFor={autoId}>{labelContent}</label>
    </div>
  )
}
export const RadioListInput = React.forwardRef(RadioListInputRef)
