import * as _ from "underscore";
import * as React from "react";
import {Form} from "../form";
import { Grid, Row, Col } from './../../layout/grid';

export interface ICheckboxInputProps extends React.HTMLProps<CheckboxInput> {
    labelContent: string | React.ReactElement<any>;
}

export class CheckboxInput extends React.Component<ICheckboxInputProps, {}> {
    render() {
        const id = "checkbox_" + Math.random();
        return (
            <div className="checkbox">
              <input id={id} { ..._.omit(this.props, "labelContent") } type="checkbox"/>
              <label htmlFor={id}/>
              <label className="checkbox-label" htmlFor={id}>{this.props.labelContent}</label>
            </div>
        );
    }
}
