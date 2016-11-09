import * as React from "react";
import * as _ from "underscore";
import * as classNames from "classnames";
import { Binder, IFormBinding} from "./../binder"

export interface ISelectInputOption {
  id: number | string;
  name: string;
}

export interface ISelectInputProps extends React.HTMLProps<SelectInput> {
  options: ISelectInputOption[];
}

export class SelectInput extends React.Component<ISelectInputProps & IFormBinding, {}> {
  change(e) {
    let v = e.target.value;
    Binder.handleChange(this.props.prop, v, typeof this.props.id, this.props.data);
    this.props.context.forceUpdate();
  }
  render() {
    let v = this.props.data[this.props.prop];
    var attrs = _.omit(this.props, "prop", "options", "context", "data");
    return <select {...attrs} onChange={(e) => this.change(e)} value={v || ""}>
      {this.props.placeholder && <option value="" disabled={true}>{this.props.placeholder}</option>}
      {this.props.options.map(o => <option key={`${this.props.prop}_option_${o.id}`} value={o.id}>{o.name}</option>)}
    </select>
  }
}