import * as React from "react";
import { classNames,cd } from "./../../utilities/classBuilder";
import { Color } from "./../../utilities/uiHelpers";
import { Icons } from "./../../utilities/icons";


export interface IIconProps extends React.HTMLProps<Icon> {
  icon: string;
  condition?: Color;
  className?: string;
}
export class Icon extends React.Component<IIconProps, {}>{
  static Icomoon = Icons.Icomoon;

  render(){
    return (
      <i { ...this.props as any } className={classNames(this.props.className, "icon", this.props.icon)}/>
    );
  }
}
