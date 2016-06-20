import * as React from "react";
import { Size, LayoutHelpers } from "./../../utilities/uiHelpers";
import { classNames, cd } from "./../../utilities/classBuilder"

export type HeadingElementType = "h1" | "h2" | "h3" | "div";
export type HeadingStyleType = "heading1" | "heading2" | "heading3";

export interface IHeadingProps extends React.Props<Heading>, React.HTMLProps<Heading> {
  elementType?: HeadingElementType;
  styleType?: HeadingStyleType;
}

export class Heading extends React.Component<IHeadingProps, {}>{
  static defaultProps = {
    elementType: "h3",
    styleType: "heading3"
  }
  render() {

    var classes = classNames(cd(this.props.styleType, this.props.styleType as any !== this.props.elementType as any), this.props.className);
    if (!classes){
      classes = null;
    }

    switch (this.props.elementType) {
      case "h1":
        return <h1 { ...this.props as any } className={classes}>{this.props.children}</h1>
      case "h2":
        return <h2 { ...this.props as any } className={classes}>{this.props.children}</h2>
      case "h3":
        return <h3 { ...this.props as any } className={classes}>{this.props.children}</h3>
      case "div":
        return <div { ...this.props as any } className={classes}>{this.props.children}</div>
    }
  }
}
