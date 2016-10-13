import * as _ from "underscore";
import * as React from "react";
import * as classNames from "classnames";
import { Form } from "../form";
import { Icon } from "./../../display/icon";
import { Icons } from "./../../../utilities/icons";

export interface ITextInputProps extends React.HTMLProps<TextInput> {
  multiLine?: boolean;
  readonly?: boolean;
  rightOverlayText?: string | React.ReactElement<any>;
  leftOverlayText?: string | React.ReactElement<any>;
  type?: string;
  leftIcon?: string;
  rightIcon?: string;
}

export class TextInput extends React.Component<ITextInputProps, {}> {
  static Icomoon = Icons.Icomoon;
  render() {
    var classes = classNames(
      "text-input",
      this.props.className,
      {
        "text-input-disabled": this.props.disabled,
        "has-text-overlay-right": this.props.rightOverlayText !== undefined,
        "has-text-overlay-left": this.props.leftOverlayText !== undefined,
        "text-input-icon-left": this.props.leftIcon !== undefined,
        "text-input-icon-right": this.props.rightIcon !== undefined
      }
    );
    var ps = _.omit(this.props, "className", "readonly", "rightOverlayText", "leftOverlayText", "type", "leftIcon", "rightIcon", "multiLine")
    return (
        <div className={classes}>
            { this.props.leftIcon && <Icon className="left-icon" icon={this.props.leftIcon}/>}
            { this.props.leftOverlayText && <div className="input-overlay-text-left">{this.props.leftOverlayText}</div> }
            { !this.props.multiLine && <input type={this.props.type || "text"} readOnly={this.props.readonly} {...ps} placeholder={this.props.placeholder} required={this.props.required} />}
            { this.props.multiLine && <textarea readOnly={this.props.readonly} {...ps} placeholder={this.props.placeholder}  />}
            { this.props.rightOverlayText && <div className="input-overlay-text-right">{this.props.rightOverlayText}</div> }
            { this.props.rightIcon && <Icon className="right-icon" icon={this.props.rightIcon}/>}
        </div>
    );
  }
}
