import * as React from "react";
import { IFormInputHTMLProps, generateUniqueId } from "../form";
import { ClassHelpers } from "../../../utilities/classNames";

export interface ICheckboxInputProps extends IFormInputHTMLProps<HTMLInputElement> {
  labelContent: string | React.ReactElement<any>;
}

export class CheckboxInput extends React.Component<ICheckboxInputProps, {}> {
  static defaultProps = {
    validationMode: "none"
  }
  render() {
    const id = generateUniqueId(u => "checkbox_" + u);
    const validationMessage = this.props["data-validation-message"]
    const { validationMode, labelContent, ...attrs } = this.props
    const classes = ClassHelpers.classNames(
      "armstrong-input",
      "checkbox",
      this.props.className,
      {
        "show-validation": (validationMode !== "none" && validationMessage)
      }
    );
    return (
      <div className={classes}>
        <input id={id} { ...attrs } type="checkbox" />
        <label htmlFor={id} />
        <label className="checkbox-label" htmlFor={id}>{labelContent}</label>
      </div>
    );
  }
}
