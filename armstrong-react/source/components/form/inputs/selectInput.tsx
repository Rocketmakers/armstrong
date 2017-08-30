import * as _ from "underscore";
import * as React from "react";
import { IFormInputHTMLProps } from "../form";
import { buildOptions } from "./options";
import { ClassHelpers } from "../../../utilities/classNames";
export interface ISelectInputOption {
  id: number | string;
  name: string;
}

export interface ISelectInputProps extends IFormInputHTMLProps<SelectInput> {
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
    this.props.change && this.props.change(this.props.options[e.target["selectedIndex"] - 1]);
    this.props.onChange && this.props.onChange(e);
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
    const classes = ClassHelpers.classNames(
      "armstrong-input",
      "select-input",
      this.props.className,
      {
        "show-validation": (this.props.validationMode !== "none" && validationMessage)
      }
    );
    let options = buildOptions(this.props.optionLabel, this.props.options, o => o.id, o => o.name, !!this.props.enableOptionLabel);
    return (
      <div className={classes} title={validationMessage}>
        <select ref={r => this.select = r} {..._.omit(this.props, "options", "change", "onChange", "optionLabel", "validationMode", "enableOptionLabel") } onChange={this.change}>
          {options}
        </select>
      </div>
    );
  }
}
