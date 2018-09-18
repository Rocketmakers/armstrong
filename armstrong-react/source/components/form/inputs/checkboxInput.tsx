import * as React from "react";
import { ClassHelpers } from "../../../utilities/classNames";
import { generateUniqueId, IFormInputHTMLProps } from "../form";
import { DataValidationMessage } from "../formCore";

export interface ICheckboxInputProps extends IFormInputHTMLProps<React.InputHTMLAttributes<HTMLInputElement>> {
  labelContent: string | React.ReactElement<any>;
}

export class CheckboxInput extends React.Component<ICheckboxInputProps, {}> {
  static defaultProps: Partial<ICheckboxInputProps> = {
    validationMode: "none",
  }

  private input: HTMLInputElement;

  focus() {
    if (this.input) {
      this.input.focus()
    }
  }
  blur() {
    if (this.input) {
      this.input.blur()
    }
  }

  render() {
    const validationMessage = DataValidationMessage.get(this.props)
    const { validationMode, labelContent, id, ...attrs } = this.props
    const autoId = id || generateUniqueId(u => "checkbox_" + u);
    const classes = ClassHelpers.classNames(
      "armstrong-input",
      "checkbox",
      this.props.className,
      {
        "show-validation": (validationMode !== "none" && validationMessage),
      },
    );
    return (
      <div className={classes}>
        <input {...attrs} ref={i => this.input = i} id={autoId} type="checkbox" />
        <label htmlFor={autoId} />
        <label className="checkbox-label" htmlFor={autoId}>{labelContent}</label>
      </div>
    );
  }
}
