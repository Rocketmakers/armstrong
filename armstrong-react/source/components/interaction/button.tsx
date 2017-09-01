import * as React from "react";
import * as _ from "underscore";
import { Size, LayoutHelpers, Color, FgColorClass, BgColorClass, MarginClass, PaddingClass } from "./../../utilities/uiHelpers";
import { Icon } from "./../display/icon";
import { ClassHelpers } from "../../utilities/classNames";

export interface IButtonProps extends React.HTMLProps<HTMLButtonElement> {
  /** ((React.MouseEvent) => void) Event to fire when the button is clicked */
  onClick?: (e?: React.MouseEvent<{}>) => void;
  /** (string) An icon to show on the left of the buttons content */
  leftIcon?: string;
  /** (string) An icon to show on the right of the buttons content */
  rightIcon?: string;
  /** (boolean) Wether or not the buttton should have rounded edges */
  rounded?: boolean;
  /** (string) CSS classname property */
  className?: string | MarginClass | PaddingClass | BgColorClass | FgColorClass;
  /** (boolean) If true, disables actions and puts button into a 'pending' state */
  pending?: boolean;
}

export function Button(props: IButtonProps) {
  function handleClick(e) {
    if (props.onClick && !props.pending) {
      props.onClick(e);
    }
  }
  var attrs = _.omit(props, "onClick", "leftIcon", "rightIcon", "className", "rounded", "context", "pending", "disabled");
  const classes = ClassHelpers.classNames(
    "btn",
    props.className,
    {
      "rounded": props.rounded,
      "icon-button-left": props.leftIcon !== undefined,
      "icon-button-right": props.rightIcon !== undefined,
      "pending": props.pending
    }
  );
  let leftIcon = props.leftIcon && <Icon className="left-icon" icon={props.leftIcon} />
  let rightIcon = props.rightIcon && <Icon className="right-icon" icon={props.rightIcon} />
  return (
    <button disabled={props.pending || props.disabled} type={props.type || 'button'} onClick={e => handleClick(e)} { ...attrs } className={classes}>
      {leftIcon}
      {props.children}
      {rightIcon}
    </button>
  );

}
