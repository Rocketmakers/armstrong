import * as React from "react";
import { ClassHelpers } from "../../../utilities/classHelpers";
import { DataValidationMessage, DataValidationMode } from "../formCore";
import { ValidationLabel } from "../validationWrapper";
import { buildOptions } from "./options";

export interface ISelectInput {
  focus: () => void
  blur: () => void
}

export interface ISelectInputOption {
  id: number | string;
  name: string;
}

export interface ISelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: ISelectInputOption[];
  onOptionChange?: (selected: ISelectInputOption) => void;
  optionLabel?: string
  enableOptionLabel?: boolean
}

const SelectInputRef: React.RefForwardingComponent<ISelectInput, ISelectInputProps> = (props, ref) => {
  const { options, onOptionChange, onChange, optionLabel, enableOptionLabel, className, ...attrs } = props

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onOptionChange) { onOptionChange(options[e.target.selectedIndex - 1]); }
    if (onChange) { onChange(e); }
  }, [onOptionChange, onChange, options])

  const select = React.useRef<HTMLSelectElement>(undefined)

  const refCallback = React.useCallback(() => {
    return {
      focus() {
        if (select.current) {
          select.current.focus()
        }
      },
      blur() {
        if (select.current) {
          select.current.blur()
        }
      },
    }
  }, [select])

  React.useImperativeHandle(ref, refCallback, [refCallback])

  const validationMessage = DataValidationMessage.get(props)
  const validationMode = DataValidationMode.get(props)

  const classes = ClassHelpers.classNames(
    "armstrong-input",
    "select-input",
    className,
    {
      "show-validation": (validationMode !== "none" && validationMessage),
    },
  );

  return (
    <div className={classes} title={validationMessage}>
      <select {...attrs} ref={select} onChange={handleChange}>
        {buildOptions(optionLabel, options, o => o.id, o => o.name, !!enableOptionLabel)}
      </select>
      <ValidationLabel message={validationMessage} mode={validationMode} />
    </div>
  );
}

export const SelectInput = React.forwardRef(SelectInputRef)

SelectInput.defaultProps = {
  optionLabel: "[Select]",
}
