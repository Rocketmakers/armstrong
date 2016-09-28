import * as _ from "underscore";
import * as React from "react";
import {Form} from "../form";

export interface IRadioInputProps extends React.HTMLProps<RadioInput> {
    labelContent: string | React.ReactElement<any>;
}

export class RadioInput extends React.Component<IRadioInputProps, {}> {
    render() {
        var id = "radio_" + Math.random();
        return (
            <div className="radio">
            <input id={id} { ..._.omit(this.props, "labelContent") } type="radio"/>
            <label htmlFor={id}/>
            <label className="radio-label" htmlFor={id}>{this.props.labelContent}</label>
            </div>
        );
    }
}
