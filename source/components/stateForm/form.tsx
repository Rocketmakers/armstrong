import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from "underscore";

interface IFormProps extends React.HTMLProps<Form> {
  /** The object your form is updating */
  entity: any;
}

export class Form extends React.Component<IFormProps, {}> {
  private supportedElements = ["TextInput", "CheckboxInput", "SelectInput", "RadioInput", "CalendarInput", "AutoCompleteInput"]
  render() {
    /** Get the parent container to force update. If this ever breaks, just pass 'this' through manually in the parent. */
    let context = this["_reactInternalInstance"]._currentElement._owner._instance;
    let data = this.props.entity;
    var attrs = _.omit(this.props, "entity");
    /** Next map all the supported children, and give them the parent for updating and the model to pick and update fields from. */
    return (
      <form {...attrs}>
        {React.Children.map(this.props.children, (child: React.ReactElement<any>) => {
          if (child) {
            if (typeof child.type === "function" && _.contains(this.supportedElements, child.type["name"])) {
              return React.cloneElement(child, { data, context })
            }
            return child;
          }
        })}
      </form>
    )
  }
}