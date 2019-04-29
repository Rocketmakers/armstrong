import * as React from "react";
import { ClassHelpers } from "../../../utilities/classHelpers";
import { IFormInputHTMLProps } from "../form";
import { DataValidationMessage } from "../formCore";
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

export interface ISelectInputProps extends IFormInputHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>> {
  options: ISelectInputOption[];
  change?: (selected: ISelectInputOption) => void;
  optionLabel?: string
  enableOptionLabel?: boolean
}

const SelectInputRef: React.RefForwardingComponent<ISelectInput, ISelectInputProps> = (props, ref) => {
  const { options, change, onChange, optionLabel, validationMode, enableOptionLabel, className, ...attrs } = props

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    if (change) { change(options[e.target.selectedIndex - 1]); }
    if (onChange) { onChange(e); }
  }, [change, onChange, options])

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
  validationMode: "none",
}
