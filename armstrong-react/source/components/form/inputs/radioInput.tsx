import * as React from "react";
import { IFormInputHTMLProps, generateUniqueId } from "../form";
import { ClassHelpers } from "../../../utilities/classNames";

export interface IRadioInputProps extends IFormInputHTMLProps<HTMLInputElement> {
  labelContent: string | React.ReactElement<any>;
}

export class RadioInput extends React.Component<IRadioInputProps, {}> {
  static defaultProps = {
    validationMode: "none"
  }
  render() {
    const validationMessage = this.props["data-validation-message"]
    const { labelContent, validationMode, ...attrs } = this.props
    const id = generateUniqueId(u => "radio_" + u);
    const classes = ClassHelpers.classNames(
      "armstrong-input",
      "radio",
      this.props.className,
      {
        "show-validation": (validationMode !== "none" && validationMessage)
      }
    );
    return (
      <div className={classes} title={validationMessage}>
        <input id={id} { ...attrs } type="radio" data-validation-message={validationMessage} />
        <label htmlFor={id} />
        <label className="radio-label" htmlFor={id}>{labelContent}</label>
      </div>
    );
  }
}
