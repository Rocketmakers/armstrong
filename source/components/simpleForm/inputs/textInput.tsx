import * as React from "react";
import * as _ from "underscore";
import * as classNames from "classnames";
import { Binder, IFormBinding } from "./../binder"

interface ITextInputProps extends React.HTMLProps<TextInput>  {
  multiLine?: boolean;
}

export class TextInput extends React.Component<ITextInputProps & IFormBinding, {}> {
  change(e) {
    Binder.handleChange(this.props.prop, e.target["value"], this.props.type, this.props.data);
    this.props.context.forceUpdate();
  }
  render() {
    var attrs = _.omit(this.props, "prop", "multiLine", "context", "data", "type");
    if (this.props.multiLine) {
      return <textarea {...attrs} onChange={(e) => this.change(e)} value={this.props.data[this.props.prop] || ""} />
    } else {
      return <input {...attrs} type={this.props.type || "text"} onChange={(e) => this.change(e)} value={this.props.data[this.props.prop] || ""} />
    }
  }
}