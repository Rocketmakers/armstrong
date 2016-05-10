import * as React from "react";
import { Size, LayoutHelpers, LayoutProps, DisplayProps } from "./../../utilities/uiHelpers";
import { classNames, cd } from "./../../utilities/classBuilder"

export type TextElementType = "p" | "span" | "label";

export interface ITextProps extends React.Props<Text>, LayoutProps, DisplayProps, React.HTMLProps<Text> {
  elementType?: TextElementType;
}

export class Text extends React.Component<ITextProps, {}>{
  static defaultProps = {
    elementType: "p"
  }
  render() {
    var layoutClasses = LayoutHelpers.HandleLayoutClasses(this.props.margin, this.props.padding)
    var displayClasses = LayoutHelpers.HandleDisplayClasses(this.props.background, this.props.foreground);
    var displayStyles = LayoutHelpers.HandleDisplayStyles(this.props.background, this.props.foreground);

    var classes = classNames(layoutClasses, displayClasses);
    if (!classes){
      classes = null;
    }

    switch (this.props.elementType) {
      case "p":
        return <p { ...this.props as any } style={displayStyles} className={classes}>{this.props.children}</p>
      case "span":
        return <span { ...this.props as any } style={displayStyles} className={classes}>{this.props.children}</span>
      case "label":
        return <label { ...this.props as any } style={displayStyles} className={classes}>{this.props.children}</label>
    }
  }
}
