import * as React from "react";
import * as _ from "underscore";
import * as classNames from "classnames";
import { Binder, IFormBinding } from "./../binder";

interface IRadioInputProps extends React.HTMLProps<RadioInput> {
  value: string | number;
  label: any;
}

export class RadioInput extends React.Component<IRadioInputProps & IFormBinding, {}> {
  change(e) {
    Binder.handleChange(this.props.prop, e.target["value"], "number", this.props.data);
    this.props.context.forceUpdate();
  }
  render(){
    let id = `radio_${this.props.prop}_${this.props.value}`;
    var attrs = _.omit(this.props, "prop", "type", "value", "data", "context", "label");
    return (
      <div className={classNames("radio", this.props.className)}>
        <input {...attrs} id={id} type="radio" name={this.props.prop} onChange={(e) => this.change(e)} value={this.props.value} defaultChecked={this.props.value === this.props.data[this.props.prop]} />
        <label htmlFor={id} />
        <label className="radio-label" htmlFor={id}>{this.props.label}</label>
      </div>
    )
  }
}