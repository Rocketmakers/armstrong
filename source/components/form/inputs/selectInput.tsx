import * as _ from "underscore";
import * as React from "react";
import { buildOptions } from "./options";
export interface ISelectInputOption {
  id: number | string;
  name: string;
}

export interface ISelectInputProps extends React.HTMLProps<SelectInput> {
  options: ISelectInputOption[];
  change?: (selected: ISelectInputOption) => void;
  optionLabel?: string
}

export class SelectInput extends React.Component<ISelectInputProps, {}> {
  private select: HTMLSelectElement;
  static defaultProps = {
    optionLabel: "[Select]"
  }
  private change = (e) => {
    this.props.change && this.props.change(this.props.options[e.target["selectedIndex"]]);
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
    return (
      <div className="select-input" data-validation-message={this.props["data-validation-message"]}>
        <select ref={r => this.select = r} {..._.omit(this.props, "options", "change", "onChange", "optionLabel") } onChange={this.change}>
          {buildOptions(this.props.optionLabel, this.props.options, o => o.id, o => o.name)}
        </select>
      </div>
    );
  }
}
