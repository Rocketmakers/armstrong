import * as React from "react";
import * as _ from "underscore";
import * as classNames from "classnames";
import { Binder, IFormBinding } from "./../binder";

export interface IToggleInputProps extends React.HTMLProps<ToggleInput> {
  /** The text to display on the toggle when it is turned on */
  onLabel?: string;
  /** The text to display on the toggle when it is turned off */
  offLabel?: string;
}

export class ToggleInput extends React.Component<IToggleInputProps & IFormBinding, { switchedOn: boolean }>{
  constructor() {
    super();
    this.state = { switchedOn: false };
  }
  toggleSwitch(){
    var newState = !this.state.switchedOn;
    this.setState({ switchedOn: newState }, ()=>{
      this.change(this.state.switchedOn);
    });
  }
  componentWillReceiveProps(newProps: IToggleInputProps & IFormBinding){
    let switchedOn = newProps.data[this.props.prop];
    if (switchedOn !== this.state.switchedOn){
      this.setState({ switchedOn })
    }
  }
  componentWillMount(){
    this.setState({ switchedOn: this.props.data[this.props.prop] })
  }
  change(on: boolean) {
    Binder.handleChange(this.props.prop, on, "boolean", this.props.data);
    this.props.context.forceUpdate();
  }
  render(){
    var attrs = _.omit(this.props, "onLabel", "offLabel", "className");
    var classes = classNames("toggle-input", this.props.className);
    return (
      <div className={classes}>
        <div className={classNames({"toggled-on": this.state.switchedOn})} {...attrs} onClick={()=> this.toggleSwitch()} title={`${this.state.switchedOn ? (this.props.onLabel || "ON") : (this.props.offLabel || "OFF")}`}></div>
        {this.props.label && <label>{this.props.label}</label>}
      </div>
    );
  }
}
