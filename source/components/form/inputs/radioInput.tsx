import * as _ from "underscore";
import * as React from "react";
import * as classNames from "classnames";
import { IFormInputHTMLProps, generateUniqueId } from "../form";

export interface IRadioInputProps extends IFormInputHTMLProps<RadioInput> {
  labelContent: string | React.ReactElement<any>;
}

export class RadioInput extends React.Component<IRadioInputProps, {}> {
  static defaultProps = {
    validationMode: "none"
  }
  render() {
    const validationMessage = this.props["data-validation-message"]

    const id = generateUniqueId(u => "radio_" + u);
    const classes = classNames(
      "radio",
      this.props.className,
      {
        "show-validation": (this.props.validationMode !== "none" && validationMessage)
      }
    );
    return (
      <div className={classes} title={validationMessage}>
        <input id={id} { ..._.omit(this.props, "labelContent", "validationMode") } type="radio" data-validation-message={validationMessage}/>
        <label htmlFor={id} />
        <label className="radio-label" htmlFor={id}>{this.props.labelContent}</label>
      </div>
    );
  }
}
