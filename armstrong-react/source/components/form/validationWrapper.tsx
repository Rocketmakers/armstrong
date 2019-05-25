import * as React from "react";
import { HTMLAttributes } from "react";
import { ClassHelpers } from "../../utilities/classHelpers";
import { ValidationModes } from "./formCore";

export const ValidationWrapper: React.FC<{ message: string } & HTMLAttributes<HTMLDivElement> & { validationMode?: ValidationModes }> = props => {
  const { message, validationMode, className, children, ...attrs } = props
  return (
    <div {...attrs} className={ClassHelpers.classNames(className, { "show-validation": (validationMode !== "none" && !!message) })} title={message}>
      {children}
      <ValidationLabel message={message} mode={validationMode} />
    </div>
  );
}

export const ValidationLabel: React.FC<{ message: string, mode: ValidationModes, wrapper?: React.StatelessComponent<{}> }> = props => {
  const { message, mode, wrapper: Wrapper } = props
  if (!message || mode === "none") {
    return null;
  }

  const validationLabel = (
    <label className={ClassHelpers.classNames("validation-message", `validation-message-${mode}`)} title={message}>
      {(mode === "both" || mode === "below") && message}
    </label>
  )

  if (Wrapper) {
    return <Wrapper>{validationLabel}</Wrapper>
  }

  return validationLabel;
}
