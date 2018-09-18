import * as React from "react";
import { HTMLAttributes } from "react";
import { ClassHelpers } from "../../utilities/classNames";
import { ValidationModes, ValidationProps } from "./form";

export class ValidationWrapper extends React.Component<{ message: string } & HTMLAttributes<HTMLDivElement> & ValidationProps, {}> {
  render() {
    const { message, validationMode, className, children, ...attrs } = this.props
    return (
      <div {...attrs} className={ClassHelpers.classNames(className, { "show-validation": (validationMode !== "none" && !!message) })} title={message}>
        {children}
        <ValidationLabel message={message} mode={validationMode} />
      </div>
    );
  }
}

export class ValidationLabel extends React.Component<{ message: string, mode: ValidationModes, wrapper?: React.StatelessComponent<any> }, {}> {
  render() {
    const { message, mode, wrapper } = this.props
    if (!message || mode === "none") {
      return null;
    }
    const validationLabel = (
      <label className={ClassHelpers.classNames("validation-message", `validation-message-${mode}`)} title={message}>
        {(mode === "both" || mode === "below") && message}
      </label>)
    const Wrapper = wrapper
    if (Wrapper) {
      return <Wrapper>{validationLabel}</Wrapper>
    }
    return validationLabel;
  }
}
