import * as _ from "underscore";
import * as React from "react";
import { Form } from "../form";

export interface ISelectInputOption {
    id: number;
    name: string;
}

export interface ISelectInputProps extends React.HTMLProps<SelectInput> {
    options: ISelectInputOption[];
    change?: (selected: ISelectInputOption) => void;
}

export class SelectInput extends React.Component<ISelectInputProps, {}> {
    change(e) {
        if (this.props.change) {
            this.props.change(this.props.options[e.target["selectedIndex"]]);
        }
    }
    render() {
        return (
            <div className="select-input">
                <select {..._.omit(this.props, "options", "change") } onChange={e => this.change(e)}>
                    {this.props.options.map((op, i) => <option key={i} value={op.id.toString()}>{op.name}</option>)}
                </select>
            </div>
        );
    }
}
