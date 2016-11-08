import * as React from "react";
import * as _ from "underscore";
import * as classNames from "classnames";
import { Binder } from "./../binder";
import { IFormInput } from "./../formInput";

interface ICheckboxInputProps extends React.HTMLProps<CheckboxInput> {
  label: any;
}

export class CheckboxInput extends React.Component<ICheckboxInputProps & IFormInput, {}> {
  change(e) {
    Binder.handleChange(this.props.prop, e.target["checked"], "boolean", this.props.data);
    this.props.context.forceUpdate();
  }
  render() {
    let id = `checkbox_${this.props.prop}`;
    var attrs = _.omit(this.props, "prop", "type", "data", "context");
    return (
      <div className={classNames("checkbox", this.props.className)}>
        <input {...attrs} id={id} type="checkbox" onChange={(e) => this.change(e)} defaultChecked={this.props.data[this.props.prop]} />
        <label htmlFor={id} />
        <label className="checkbox-label" htmlFor={id}>{this.props.label}</label>
      </div>
    )
  }
}