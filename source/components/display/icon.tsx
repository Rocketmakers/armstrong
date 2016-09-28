import * as React from "react";
import * as _ from "underscore";
import * as classNames from "classnames";
import { Color } from "./../../utilities/uiHelpers";
import { Icons } from "./../../utilities/icons";


export interface IIconProps extends React.HTMLProps<Icon> {
  /** (string) The icons 'classname' eg Icon.Icomoon.Rocket */
  icon: string;
  /** (string) CSS classname property */
  className?: string;
}
export class Icon extends React.Component<IIconProps, {}>{
  static Icomoon = Icons.Icomoon;

  render(){
    var attrs = _.omit(this.props, "icon", "className");
    return (
      <i { ...attrs } className={classNames(this.props.className, "icon", this.props.icon)}/>
    );
  }
}
