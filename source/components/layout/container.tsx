import * as React from "react";
import { Size, LayoutHelpers, LayoutProps, DisplayProps } from "./../../utilities/uiHelpers";
import { classNames, cd } from "./../../utilities/classBuilder"

export interface IContainerProps extends React.Props<Container>, LayoutProps, DisplayProps {
}

export class Container extends React.Component<IContainerProps, {}>{
  render() {
    var layoutClasses = LayoutHelpers.HandleLayoutClasses(this.props.margin, this.props.padding)
    var displayClasses = LayoutHelpers.HandleDisplayClasses(this.props.background, this.props.foreground);
    var displayStyles = LayoutHelpers.HandleDisplayStyles(this.props.background, this.props.foreground);

    var classes = classNames(layoutClasses, displayClasses);
    if (!classes) {
      classes = null;
    }
    return <div style={displayStyles} className={classes}>{this.props.children}</div>
  }
}
