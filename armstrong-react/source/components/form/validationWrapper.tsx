import * as React from "react";
import * as classNames from "classnames";
import { IFormInputHTMLProps, ValidationModes } from "./form";
import * as _ from "underscore";

export class ValidationWrapper extends React.Component<{ message: string } & IFormInputHTMLProps<HTMLDivElement>, {}> {
  render() {
    var props = _.omit(this.props, "message", "validationMode")
    return (
      <div {...props} className={classNames(this.props.className, { "show-validation": (this.props.validationMode !== "none" && !!this.props.message) })} title={this.props.message}>
        {this.props.children}
        <ValidationLabel message={this.props.message} mode={this.props.validationMode} />
      </div>
    );
  }
}

export class ValidationLabel extends React.Component<{ message: string, mode: ValidationModes, wrapper?: React.StatelessComponent<any> }, {}> {
  render() {
    if (!this.props.message || this.props.mode === "none") {
      return null;
    }
    const validationLabel = (
      <label className={classNames("validation-message", `validation-message-${this.props.mode}`)} title={this.props.message}>
        {(this.props.mode === "both" || this.props.mode === "below") && this.props.message}
      </label>)
    const Wrapper = this.props.wrapper
    if (Wrapper) {
      return <Wrapper>{validationLabel}</Wrapper>
    }
    return validationLabel;
  }
}