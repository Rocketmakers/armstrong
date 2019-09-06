import * as React from "react";

export interface ITooltipProps {
  /** (JSX.Element) The content to appear on hover.  Passing a string will apply it as an aria-label to children, if ariaLabel not passed */
  tooltip: JSX.Element | string
  /** (JSX.Element) The content that causes the tooltip to appear when hovered. */
  children: JSX.Element
  /** (string) aria-label for children */
  ariaLabel?: string
  /** (boolean) Apples aria-hidden to tooltip, default true */
  ariaHideTooltip?: boolean
  /** (boolean) Retain tooltip when tooltip is hovered, default false */
  retain?: boolean
}

export const Tooltip: React.FC<ITooltipProps> = props => {
  const ariaLabel = React.useMemo(() => {
    if (props.ariaLabel) {
      return props.ariaLabel
    } else if (typeof props.tooltip === "string") {
      return props.tooltip
    } else {
      return
    }
  }, [props.ariaLabel])

  const ariaHidden = React.useMemo(() => {
    if (props.ariaHideTooltip || props.ariaHideTooltip === false) {
      return props.ariaHideTooltip
    } else {
      return false
    }
  }, [props.ariaHideTooltip])

  return (
    <div className="tooltip-wrapper" data-retain={!!props.retain}>
      <div className="tooltip-children" aria-label={ ariaLabel }>
        {props.children}
      </div>
      <div className="tooltip" aria-hidden={ ariaHidden }>
        {props.tooltip}
      </div>
    </div>
  )
}
