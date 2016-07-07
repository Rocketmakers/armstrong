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
    leftOverlayText?: string;
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
            cd("has-text-overlay-right", this.props.rightOverlayText !== undefined),
            cd("has-text-overlay-left", this.props.leftOverlayText !== undefined),
            cd("text-input-icon-left", this.props.leftIcon !== undefined),
            cd("text-input-icon-right", this.props.rightIcon !== undefined),
            this.props.className);
            var ps = _.omit(this.props, "className")
        return (
            <div className={classes}>
                { this.props.leftIcon && <Icon className="left-icon" icon={this.props.leftIcon}/>}
                { this.props.leftOverlayText && <div className="input-overlay-text-left">{this.props.leftOverlayText}</div> }
                { !this.props.multiLine && <input type={this.props.type || "text"} readOnly={this.props.readonly} {...ps as any} placeholder={this.props.placeholder} required={this.props.required} />}
                { this.props.multiLine && <textarea readOnly={this.props.readonly} {...this.props as any} placeholder={this.props.placeholder}  />}
                { this.props.rightOverlayText && <div className="input-overlay-text-right">{this.props.rightOverlayText}</div> }
                { this.props.rightIcon && <Icon className="right-icon" icon={this.props.rightIcon}/>}
            </div>
        );
    }
}
