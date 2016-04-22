import * as _ from "underscore";
import * as React from "react";
import {Form} from "../form";

export interface IRadioInputProps extends React.HTMLProps<RadioInput> {
    label: string;
}

export class RadioInput extends React.Component<IRadioInputProps, {}> {
    render() {
        var id = "radio_" + Math.random();
        return (
            <div className="radio">
            <input id={id} {...this.props as any} type="radio"/>
            <label htmlFor={id}>{this.props.label}</label>
            </div>
        );
    }
}
