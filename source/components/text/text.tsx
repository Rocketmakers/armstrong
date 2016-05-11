import * as React from "react";
import { Size, LayoutHelpers } from "./../../utilities/uiHelpers";
import { classNames, cd } from "./../../utilities/classBuilder"

export type TextElementType = "p" | "span" | "label";

export interface ITextProps extends React.Props<Text>,React.HTMLProps<Text> {
  elementType?: TextElementType;
}

export class Text extends React.Component<ITextProps, {}>{
  static defaultProps = {
    elementType: "p"
  }
  render() {

    switch (this.props.elementType) {
      case "p":
        return <p { ...this.props as any }>{this.props.children}</p>
      case "span":
        return <span { ...this.props as any }>{this.props.children}</span>
      case "label":
        return <label { ...this.props as any }>{this.props.children}</label>
    }
  }
}
