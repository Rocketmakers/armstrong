import * as React from "react";
import * as _ from "underscore";
import * as classNames from "classnames";
import { Size, LayoutHelpers, Color, FgColorClass, BgColorClass, MarginClass, PaddingClass } from "./../../utilities/uiHelpers";
import { Icon } from "./../display/icon";
import { Icons } from "./../../utilities/icons";

export interface IButtonProps extends React.HTMLProps<Button> {
  text: string | React.ReactElement<any>;
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
    const classes = classNames(
      "btn",
      this.props.className,
      {
        "rounded": this.props.rounded,
        "icon-button-left": this.props.leftIcon !== undefined,
        "icon-button-right": this.props.rightIcon !== undefined
      }
    );
    return (
      <button onClick={this.props.onClick} { ...attrs }
      className={classes}>
      {this.props.leftIcon && <Icon className="left-icon" icon={this.props.leftIcon}/>}
      <span>{this.props.text}</span>
      {this.props.rightIcon && <Icon className="right-icon" icon={this.props.rightIcon}/>}
      </button>
    );
  }
}
