import * as React from "react";
import { ClassHelpers } from "../../utilities/classHelpers";
import { Icons } from "./../../utilities/icons";

export interface IIconProps extends React.HTMLAttributes<HTMLElement> {
  /** (string) The icons 'className' eg Icon.Icomoon.Rocket */
  icon: string;
  /** (string) CSS className property */
  className?: string;
}

export function Icon(props: IIconProps) {
  const { icon, className, ...attrs } = props
  return (
    <i {...attrs} className={ClassHelpers.classNames(className, "icon", icon)} />
  );
}

Icon.Icomoon = Icons.Icomoon
