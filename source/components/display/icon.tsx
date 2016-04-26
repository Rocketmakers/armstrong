import * as React from "react";
import { classNames,cd } from "./../../utilities/classBuilder";
import { Color, LayoutHelpers, LayoutProps } from "./../../utilities/uiHelpers";
import { Icons } from "./../../utilities/icons";


export interface IIconProps extends LayoutProps {
  icon: string;
  condition?: Color;
  className?: string;
}
export class Icon extends React.Component<IIconProps, {}>{
  static Icomoon = Icons.Icomoon;

  render(){
    var displayClasses = LayoutHelpers.HandleDisplayClasses({ color: this.props.condition });
    var layoutClasses = LayoutHelpers.HandleLayoutClasses(this.props.margin, this.props.padding);
    return (
      <i className={classNames(this.props.className, "icon", this.props.icon, displayClasses, layoutClasses)}/>
    );
  }
}
