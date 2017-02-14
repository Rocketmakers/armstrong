import * as _ from "underscore";
import * as React from "react";
import * as classNames from "classnames";
import { IFormInputHTMLProps } from "../form";

export interface ICheckboxInputProps extends IFormInputHTMLProps<CheckboxInput> {
  labelContent: string | React.ReactElement<any>;
}

export class CheckboxInput extends React.Component<ICheckboxInputProps, {}> {
  static defaultProps = {
    validationMode: "none"
  }
  render() {
    const id = "checkbox_" + Math.random();
    var classes = classNames(
      "checkbox",
      this.props.className,
      {
        "show-validation": (this.props.validationMode !== "none" && this.props["data-validation-message"])
      }
    );
    return (
      <div className={classes}>
        <input id={id} { ..._.omit(this.props, "labelContent", "validationMode") } type="checkbox" />
        <label htmlFor={id} />
        <label className="checkbox-label" htmlFor={id}>{this.props.labelContent}</label>
      </div>
    );
  }
}
