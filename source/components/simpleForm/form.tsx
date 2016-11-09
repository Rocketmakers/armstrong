import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from "underscore";

interface IFormProps extends React.HTMLProps<Form> {
  /** The object your form is updating */
  entity: any;
}

export class Form extends React.Component<IFormProps, {}> {
  /** This array should list all armstrongs form components by Classname. It lets us optimize the date we pass to the form */
  private supportedElements = ["TextInput", "CheckboxInput", "SelectInput", "RadioInput", "CalendarInput", "AutoCompleteInput", "TimeInput", "DateInput", "ToggleInput"]

  recursiveCloneChildren(children: React.ReactNode, data, context) {
    return React.Children.map(children, (child: React.ReactElement<any>) => {
      /** If the child isn't an object, simply return it */
      if(!_.isObject(child)){
        return child;
      }
      /** Check if the child is one of our form elements. If so, give it context and data */
      let needsContext = typeof child.type === "function" && _.contains(this.supportedElements, child.type["name"])
      if (typeof child.type === "function" && _.contains(this.supportedElements, child.type["name"])) {
        needsContext = true;
      }
      var childProps = { data: needsContext ? data : null, context: needsContext ? context : null };
      if (child.props.children){
        childProps["children"] = this.recursiveCloneChildren(child.props.children, data, context);
      }
      return React.cloneElement(child, childProps);
    })
  }

  render() {
    /** Get the parent container to force update. If this ever breaks, just pass 'this' through manually in the parent. */
    let context = this["_reactInternalInstance"]._currentElement._owner._instance;
    let data = this.props.entity;
    var attrs = _.omit(this.props, "entity");
    /** Next map all the supported children, and give them the parent for updating and the model to pick and update fields from. */
    return (
      <form {...attrs}>
        {this.recursiveCloneChildren(this.props.children, data, context)}
      </form>
    )
  }
}