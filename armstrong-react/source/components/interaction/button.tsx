import * as React from "react";
import * as _ from "underscore";
import { Size, LayoutHelpers, Color, FgColorClass, BgColorClass, MarginClass, PaddingClass } from "./../../utilities/uiHelpers";
import { Icon } from "./../display/icon";
import { ClassHelpers } from "../../utilities/classNames";
import { DetailedHTMLProps, HTMLAttributes, ClassAttributes, AllHTMLAttributes, Props } from 'react';

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** (string) An icon to show on the left of the buttons content */
  leftIcon?: string;
  /** (string) An icon to show on the right of the buttons content */
  rightIcon?: string;
  /** (boolean) Wether or not the button should have rounded edges */
  rounded?: boolean;
  /** (boolean) If true, disables actions and puts button into a 'pending' state */
  pending?: boolean;
}
export class Button extends React.Component<IButtonProps> {

  private handleClick = (e) => {
    const { onClick, pending } = this.props
    if (onClick && !pending) {
      onClick(e);
    }
  }

  public input: HTMLButtonElement;
  public focus() {
    this.input && this.input.focus()
  }
  public blur() {
    this.input && this.input.blur()
  }
  render() {
    const { onClick, leftIcon, rightIcon, className, rounded, pending, disabled, type, children, ...attrs } = this.props
    const classes = ClassHelpers.classNames(
      "btn",
      className,
      {
        "rounded": rounded,
        "icon-button-left": leftIcon !== undefined,
        "icon-button-right": rightIcon !== undefined,
        "pending": pending
      }
    );
    return (
      <button disabled={pending || disabled} type={type || 'button'} onClick={this.handleClick} {...attrs} ref={r => this.input = r} className={classes}>
        {leftIcon && <Icon className="left-icon" icon={leftIcon} />}
        {children}
        {rightIcon && <Icon className="right-icon" icon={rightIcon} />}
      </button>
    );
  }
}
