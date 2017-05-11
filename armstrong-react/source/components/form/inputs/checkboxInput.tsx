import * as _ from "underscore";
import * as React from "react";
import { IFormInputHTMLProps, generateUniqueId } from "../form";
import { ClassHelpers } from "../../../utilities/classNames";

export interface ICheckboxInputProps extends IFormInputHTMLProps<CheckboxInput> {
  labelContent: string | React.ReactElement<any>;
}

export class CheckboxInput extends React.Component<ICheckboxInputProps, {}> {
  static defaultProps = {
    validationMode: "none"
  }
  render() {
    const id = generateUniqueId( u => "checkbox_" + u);
    const validationMessage = this.props["data-validation-message"]

    var classes = ClassHelpers.classNames(
      "armstrong-input",
      "checkbox",
      this.props.className,
      {
        "show-validation": (this.props.validationMode !== "none" && validationMessage)
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
