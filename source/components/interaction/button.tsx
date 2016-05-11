import * as React from "react";
import { Size, LayoutHelpers, Color, FgColorClass, BgColorClass, MarginClass, PaddingClass } from "./../../utilities/uiHelpers";
import { classNames, cd } from "./../../utilities/classBuilder";
import { Icon } from "./../display/icon";
import { Icons } from "./../../utilities/icons";

export interface IButtonProps extends React.HTMLProps<Button> {
  text: string;
  onClick?: ()=> void;
  leftIcon?: string;
  rightIcon?: string;
  rounded?: boolean;
  className?: string | MarginClass | PaddingClass | BgColorClass | FgColorClass;
}

export class Button extends React.Component<IButtonProps, {}>{
  static Icomoon = Icons.Icomoon;

  render() {
    return (
      <button onClick={this.props.onClick} { ...this.props as any } className={classNames("btn", cd("rounded", this.props.rounded), this.props.className)}>
      {this.props.leftIcon && <Icon className="left-icon" icon={this.props.leftIcon}/>}
      {this.props.text}
      {this.props.rightIcon && <Icon className="right-icon" icon={this.props.rightIcon}/>}
      </button>
    );
  }
}
