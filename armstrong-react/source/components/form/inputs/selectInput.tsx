import * as React from "react";
import { ClassHelpers } from "../../../utilities/classHelpers";
import { DataValidationMessage, DataValidationMode } from "../formCore";
import { ValidationLabel } from "../validationWrapper";
import { buildOptions } from "./options";

export interface ISelectInput {
  focus: () => void;
  blur: () => void;
}

export interface ISelectInputOption {
  id: number | string;
  name: string;
  data?: any;
}

export interface ISelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {  
  /** The options to select from */
  options: ISelectInputOption[];
  /** Fires when dropdown item is selected */
  onOptionChange?: (selected: ISelectInputOption) => void;
  /** The placeholder label when nothing is selected */
  optionLabel?: string;
  /** Turns a placeholder label on or off */
  enableOptionLabel?: boolean;
  /** Adds a label above the input */
  label?: string;
}

const SelectInputRef: React.RefForwardingComponent<ISelectInput, ISelectInputProps> = (props, ref) => {
  const { options, onOptionChange, onChange, optionLabel, enableOptionLabel, className, placeholder, label, ...attrs } = props;

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onOptionChange) {
        onOptionChange(options[e.target.selectedIndex - 1]);
      }
      if (onChange) {
        onChange(e);
      }
    },
    [onOptionChange, onChange, options]
  );

  const select = React.useRef<HTMLSelectElement>(undefined);

  const refCallback = React.useCallback(() => {
    return {
      focus() {
        if (select.current) {
          select.current.focus();
        }
      },
      blur() {
        if (select.current) {
          select.current.blur();
        }
      }
    };
  }, [select]);

  React.useImperativeHandle(ref, refCallback, [refCallback]);

  const validationMessage = DataValidationMessage.get(props);
  const validationMode = DataValidationMode.get(props);

  const classes = ClassHelpers.classNames("armstrong-input", "select-input", className, {
    "show-validation": validationMode !== "none" && validationMessage
  });

  return (
    <div className={classes} title={validationMessage}>
      {label && <label className="armstrong-label">{label}</label>}
      <select {...attrs} ref={select} onChange={handleChange}>
        {placeholder && (
          <option value="" disabled selected hidden>
            {placeholder}
          </option>
        )}
        {buildOptions(
          optionLabel,
          options,
          o => o.id,
          o => o.name,
          !!enableOptionLabel
        )}
      </select>
      <ValidationLabel message={validationMessage} mode={validationMode} />
    </div>
  );
};

export const SelectInput = React.forwardRef(SelectInputRef);

SelectInput.defaultProps = {
  optionLabel: "[Select]"
};
