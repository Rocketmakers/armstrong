import * as React from "react";
import { IFormInputHTMLProps } from "../form";
import { buildOptions } from "./options";
import { ClassHelpers } from "../../../utilities/classNames";

export interface ISelectInputOption {
  id: number | string;
  name: string;
}

export interface ISelectInputProps extends IFormInputHTMLProps<HTMLSelectElement> {
  options: ISelectInputOption[];
  change?: (selected: ISelectInputOption) => void;
  optionLabel?: string
  enableOptionLabel?: boolean
}

export class SelectInput extends React.Component<ISelectInputProps, {}> {
  private select: HTMLSelectElement;
  static defaultProps = {
    optionLabel: "[Select]",
    validationMode: "none"
  }
  private change = (e) => {
    const { change, onChange, options } = this.props
    change && change(options[e.target["selectedIndex"] - 1]);
    onChange && onChange(e);
  }
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
    const validationMessage = this.props["data-validation-message"]
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
        <select ref={r => this.select = r} {...attrs } onChange={this.change}>
          {buildOptions(optionLabel, options, o => o.id, o => o.name, !!enableOptionLabel)}
        </select>
      </div>
    );
  }
}
