import * as _ from "underscore";
import * as React from "react";
import { Form } from "../form";
import { Icon } from "./../../display/icon";
import { Icons } from "./../../../utilities/icons";
import { classNames, cd } from "./../../../utilities/classBuilder";

export interface ITextInputProps extends React.HTMLProps<TextInput> {
    multiLine?: boolean;
    readonly?: boolean;
    rightOverlayText?: string;
    type?: string;
    leftIcon?: string;
    rightIcon?: string;
}

export class TextInput extends React.Component<ITextInputProps, {}> {
    static Icomoon = Icons.Icomoon;
    render() {
        var classes = classNames(
            "text-input",
            cd("text-input-disabled", this.props.disabled),
            cd("has-text-overlay", this.props.rightOverlayText !== undefined),
            cd("text-input-icon-left", this.props.leftIcon !== undefined),
            cd("text-input-icon-right", this.props.rightIcon !== undefined))
        return (
            <div className={classes}>
                {this.props.leftIcon && <Icon className="left-icon" icon={this.props.leftIcon}/>}
                { !this.props.multiLine && <input type={this.props.type || "text"} readOnly={this.props.readonly} {...this.props as any} placeholder={this.props.placeholder} required={this.props.required} />}
                { this.props.multiLine && <textarea readOnly={this.props.readonly} {...this.props as any} placeholder={this.props.placeholder}  />}
                {this.props.rightOverlayText && <div className="input-overlay-text">{this.props.rightOverlayText}</div> }
                {this.props.rightIcon && <Icon className="right-icon" icon={this.props.rightIcon}/>}
            </div>
        );
    }
}
