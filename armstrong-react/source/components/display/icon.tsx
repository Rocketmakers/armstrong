import * as React from "react";
import { ClassHelpers } from "../../utilities/classNames";
import { Icons } from "./../../utilities/icons";

export interface IIconProps extends React.HTMLAttributes<HTMLElement> {
  /** (string) The icons 'classname' eg Icon.Icomoon.Rocket */
  icon: string;
  /** (string) CSS classname property */
  className?: string;
}
export class Icon extends React.Component<IIconProps, {}> {
  static Icomoon = Icons.Icomoon;

  render() {
    const { icon, className, ...attrs } = this.props
    return (
      <i {...attrs} className={ClassHelpers.classNames(className, "icon", icon)} />
    );
  }
}
