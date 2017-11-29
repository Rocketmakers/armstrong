import * as React from "react";
import { Color } from "./../../utilities/uiHelpers";
import { Icons } from "./../../utilities/icons";
import { ClassHelpers } from "../../utilities/classNames";

export interface IIconProps extends React.HTMLProps<HTMLElement> {
  /** (string) The icons 'classname' eg Icon.Icomoon.Rocket */
  icon: string;
  /** (string) CSS classname property */
  className?: string;
}
export class Icon extends React.Component<IIconProps, {}>{
  static Icomoon = Icons.Icomoon;

  render() {
    const { icon, className, ...attrs} = this.props
    return (
      <i { ...attrs } className={ClassHelpers.classNames(className, "icon", icon)} />
    );
  }
}
