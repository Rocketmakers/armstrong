import * as React from "react";
import * as _ from "underscore";
import * as classNames from "classnames";
import { Size, LayoutHelpers, Color, FgColorClass, BgColorClass, MarginClass, PaddingClass } from "./../../utilities/uiHelpers";
import { Icon } from "./../display/icon";
import { Icons } from "./../../utilities/icons";

export interface IButtonProps extends React.HTMLProps<Button> {
  /** ((React.MouseEvent) => void) Event to fire when the button is clicked */
  onClick?: (e?: React.MouseEvent)=> void;
  /** (string) An icon to show on the left of the buttons content */
  leftIcon?: string;
  /** (string) An icon to show on the right of the buttons content */
  rightIcon?: string;
  /** (boolean) Wether or not the buttton should have rounded edges */
  rounded?: boolean;
  /** (string) CSS classname property */
  className?: string | MarginClass | PaddingClass | BgColorClass | FgColorClass;
}

export class Button extends React.Component<IButtonProps, {}>{
  static Icomoon = Icons.Icomoon;

  render() {
    var attrs = _.omit(this.props, "onClick", "leftIcon", "rightIcon", "className", "rounded");
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
      <button type={this.props.type || 'button'} onClick={this.props.onClick} { ...attrs } className={classes}>
      {this.props.leftIcon && <Icon className="left-icon" icon={this.props.leftIcon}/>}
      {this.props.children}
      {this.props.rightIcon && <Icon className="right-icon" icon={this.props.rightIcon}/>}
      </button>
    );
  }
}
