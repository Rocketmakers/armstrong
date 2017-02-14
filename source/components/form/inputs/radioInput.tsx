import * as _ from "underscore";
import * as React from "react";
import * as classNames from "classnames";
import { IFormInputHTMLProps } from "../form";

export interface IRadioInputProps extends IFormInputHTMLProps<RadioInput> {
  labelContent: string | React.ReactElement<any>;
}

export class RadioInput extends React.Component<IRadioInputProps, {}> {
  static defaultProps = {
    validationMode: "none"
  }
  render() {
    var id = "radio_" + Math.random();
    var classes = classNames(
      "radio",
      this.props.className,
      {
        "show-validation": (this.props.validationMode !== "none" && this.props["data-validation-message"])
      }
    );
    return (
      <div className={classes} title={this.props["data-validation-message"]}>
        <input id={id} { ..._.omit(this.props, "labelContent", "validationMode") } type="radio" data-validation-message={this.props["data-validation-message"]}/>
        <label htmlFor={id} />
        <label className="radio-label" htmlFor={id}>{this.props.labelContent}</label>
      </div>
    );
  }
}
