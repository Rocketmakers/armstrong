import * as _ from "underscore";
import * as React from "react";
import {Form} from "../form";

export interface ITextInputProps extends React.HTMLProps<TextInput> {
    multiLine?: boolean;
    readonly?: boolean;
    rightOverlayText?: string;
    type?: string;
}

export class TextInput extends React.Component<ITextInputProps, {}> {
    render() {
        var textInputClasses = ["text-input"];
        if (this.props.disabled) {
            textInputClasses.push("text-input-disabled");
        }
        if (this.props.rightOverlayText){
          textInputClasses.push("has-text-overlay");
        }
        return (
            <div className={textInputClasses.join(" ") }>
            { !this.props.multiLine && <input type={this.props.type || "text"} readOnly={this.props.readonly} {...this.props as any} placeholder={this.props.placeholder} required={this.props.required} />}
            { this.props.multiLine && <textarea readOnly={this.props.readonly} {...this.props as any} placeholder={this.props.placeholder}  />}
            {this.props.rightOverlayText && <div className="input-overlay-text">{this.props.rightOverlayText}</div> }
            </div>
        );
    }
}
