import * as React from "react";
import * as _ from "underscore";
import * as classNames from "classnames";
import { Binder } from "./../binder"
import { IFormInput } from "./../formInput";

export interface ISelectInputOption {
  id: number | string;
  name: string;
}

export interface ISelectInputProps extends React.HTMLProps<SelectInput> {
  options: ISelectInputOption[];
}

export class SelectInput extends React.Component<ISelectInputProps & IFormInput, {}> {
  change(e) {
    Binder.handleChange(this.props.prop, this.props.options[e.target["selectedIndex"]].id, typeof this.props.id, this.props.data);
    this.props.context.forceUpdate();
  }
  render() {
    var attrs = _.omit(this.props, "prop", "options", "context", "data");
    return <select {...attrs} onChange={(e) => this.change(e)} defaultValue={this.props.data[this.props.prop]}>
      {this.props.options.map(o => <option key={`${this.props.prop}_option_${o.id}`} value={o.id}>{o.name}</option>)}
    </select>
  }
}