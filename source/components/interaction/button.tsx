import * as React from "react";
import * as _ from "underscore";
import { Size, LayoutHelpers, Color, FgColorClass, BgColorClass, MarginClass, PaddingClass } from "./../../utilities/uiHelpers";
import { classNames, cd } from "./../../utilities/classBuilder";
import { Icon } from "./../display/icon";
import { Icons } from "./../../utilities/icons";

export interface IButtonProps extends React.HTMLProps<Button> {
  text: string | JSX.Element;
  onClick?: (e?)=> void;
  leftIcon?: string;
  rightIcon?: string;
  rounded?: boolean;
  className?: string | MarginClass | PaddingClass | BgColorClass | FgColorClass;
}

export class Button extends React.Component<IButtonProps, {}>{
  static Icomoon = Icons.Icomoon;

  render() {
    var attrs = _.omit(this.props, "text", "onClick", "leftIcon", "rightIcon", "className", "rounded");
    return (
      <button onClick={this.props.onClick} { ...attrs }
      className={
        classNames("btn",
        cd("rounded", this.props.rounded),
        cd("icon-button-left", this.props.leftIcon !== undefined),
        cd("icon-button-right", this.props.rightIcon !== undefined),
        this.props.className)
      }>
      {this.props.leftIcon && <Icon className="left-icon" icon={this.props.leftIcon}/>}
      <span>{this.props.text}</span>
      {this.props.rightIcon && <Icon className="right-icon" icon={this.props.rightIcon}/>}
      </button>
    );
  }
}
