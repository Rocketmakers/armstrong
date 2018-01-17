import * as React from "react";
import { IFormInputHTMLProps } from "../form";
import { buildOptions } from "./options";
import { ClassHelpers } from "../../../utilities/classNames";
import { DataValidationMessage } from '../formCore';
import { ValidationLabel } from "../validationWrapper";

export interface ISelectInputOption {
  id: number | string;
  name: string;
}

export interface ISelectInputProps extends IFormInputHTMLProps<SelectInput, React.SelectHTMLAttributes<HTMLSelectElement>> {
  options: ISelectInputOption[];
  change?: (selected: ISelectInputOption) => void;
  optionLabel?: string
  enableOptionLabel?: boolean
}

export class SelectInput extends React.Component<ISelectInputProps, {}> {
  static defaultProps: Partial<ISelectInputProps> = {
    optionLabel: "[Select]",
    validationMode: "none"
  }
  private change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { change, onChange, options } = this.props
    change && change(options[e.target["selectedIndex"] - 1]);
    onChange && onChange(e);
  }
  private select: HTMLSelectElement;
  public focus() {
    if (this.select) {
      this.select.focus()
    }
  }
  public blur() {
    if (this.select) {
      this.select.blur()
    }
  }
  render() {
    const validationMessage = DataValidationMessage.get(this.props)
    const { options, change, onChange, optionLabel, validationMode, enableOptionLabel, ...attrs } = this.props
    const classes = ClassHelpers.classNames(
      "armstrong-input",
      "select-input",
      this.props.className,
      {
        "show-validation": (validationMode !== "none" && validationMessage)
      }
    );

    return (
      <div className={classes} title={validationMessage}>
        <select {...attrs } ref={r => this.select = r} onChange={this.change}>
          {buildOptions(optionLabel, options, o => o.id, o => o.name, !!enableOptionLabel)}
        </select>
        <ValidationLabel message={validationMessage} mode={validationMode} />
      </div>
    );
  }
}