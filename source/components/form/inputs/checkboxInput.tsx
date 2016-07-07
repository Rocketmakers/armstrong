import * as _ from "underscore";
import * as React from "react";
import {Form} from "../form";
import { Grid, Row, Col } from './../../layout/grid';

export interface ICheckboxInputProps extends React.HTMLProps<CheckboxInput> {
    label: string;
}

export class CheckboxInput extends React.Component<ICheckboxInputProps, {}> {
    render() {
        var id = "radio_" + Math.random();
        return (
            <div className="checkbox">
            <input id={id} { ...this.props as any } type="checkbox"/>
            <label htmlFor={id}/>
            <label className="checkbox-label" htmlFor={id}>{this.props.label}</label>
            </div>
        );
    }
}
