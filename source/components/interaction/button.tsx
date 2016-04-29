import * as React from "react";
import { Size, LayoutHelpers, LayoutProps, Color } from "./../../utilities/uiHelpers";
import { classNames, cd } from "./../../utilities/classBuilder";
import { Icon } from "./../display/icon";
import { Icons } from "./../../utilities/icons";

export interface IButtonProps extends LayoutProps, React.HTMLProps<Button> {
  text: string;
  onClick?: ()=> void;
  condition?: Color;
  leftIcon?: string;
  rightIcon?: string;
  rounded?: boolean;
}

export class Button extends React.Component<IButtonProps, {}>{
  static Icomoon = Icons.Icomoon;

  render() {
    var layoutClasses = LayoutHelpers.HandleLayoutClasses(this.props.margin, this.props.padding);
    var displayClasses = LayoutHelpers.HandleDisplayClasses({ color: this.props.condition });
    return (
      <button onClick={this.props.onClick} { ...this.props as any } className={classNames("btn", cd("rounded", this.props.rounded),layoutClasses, displayClasses)}>
      {this.props.leftIcon && <Icon className="left-icon" icon={this.props.leftIcon}/>}
      {this.props.text}
      {this.props.rightIcon && <Icon className="right-icon" icon={this.props.rightIcon}/>}
      </button>
    );
  }
}
