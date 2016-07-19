import * as _ from "underscore";
import * as React from "react";
import {Form} from "../form";

export interface ISelectInputProps extends React.HTMLProps<SelectInput> {
  options: { id: number, name: string }[];
}

export class SelectInput extends React.Component<ISelectInputProps, {}> {
    render() {
        return (
          <div className="select-input">
            <select {..._.omit(this.props, "options")}>
            {this.props.options.map((op,i) => <option key={ i } value={op.id.toString()}>{op.name}</option>)}
            </select>
            </div>
        );
    }
}
