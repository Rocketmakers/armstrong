import * as React from "react";
import * as _ from "underscore";
import * as classNames from "classnames";
import { Binder } from "./../binder"
import { IFormInput } from "./../formInput"

interface ITextInputProps extends React.HTMLProps<TextInput>  {
  multiLine?: boolean;
}

export class TextInput extends React.Component<ITextInputProps & IFormInput, {}> {
  change(e) {
    Binder.handleChange(this.props.prop, e.target["value"], this.props.type, this.props.data);
    this.props.context.forceUpdate();
  }
  render() {
    var attrs = _.omit(this.props, "prop", "multiLine", "context", "data");
    if (this.props.multiLine) {
      return <textarea {...attrs} onChange={(e) => this.change(e)} defaultValue={this.props.data[this.props.prop]} />
    } else {
      return <input {...attrs} onChange={(e) => this.change(e)} defaultValue={this.props.data[this.props.prop]} />
    }
  }
}