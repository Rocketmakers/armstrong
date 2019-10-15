import * as React from "react";
import _ = require('underscore');

export type ITooltipPosition = "left" | "right" | "top" | "bottom" | "fixed" | "hidden"

export type ITooltipPositions = ITooltipPosition | ITooltipPosition[]

export type ITooltipCustomPositions = string | string[]

export type ITooltipPositionPriority = [ITooltipPosition, ITooltipPosition, ITooltipPosition, ITooltipPosition, ITooltipPosition, ITooltipPosition]

export interface ITooltipProps {
  /** (JSX.Element | string) The content to appear on hover.  Passing a string will apply it as an aria-label to children, if ariaLabel not passed */
  tooltip: JSX.Element | string
  /** (JSX.Element) The content that causes the tooltip to appear when hovered. */
  children: JSX.Element
  /** (string) aria-label for children */
  ariaLabel?: string
  /** (boolean) Apples aria-hidden to tooltip, default true */
  ariaHideTooltip?: boolean
  /** (boolean) Retain tooltip when tooltip is hovered, default false */
  retain?: boolean
  /** (Position) Priority order, or just top priority, for tooltip location, default ["right", "left", "bottom", "top", "fixed", "hidden"].  Only for use with preset positions, & appends unspecified positions to user defined list. */
  position?: ITooltipPositions
  /** (ITooltipCustomPositions) Priority order, or just top priority, for tooltip location.  Overrides position prop.  Can use custom user positions created in css, & preset positions. */
  customPosition?: ITooltipCustomPositions
  /** (boolean) When true, uses display rather than opacity to show/hide the tooltip, default false */
  displayNone?: boolean
  /** (string) Appended to the className of the tooltip wrapper */
  tooltipWrapperClass?: string
  /** (string) Appended to the className of the tooltip children */
  tooltipChildrenClass?: string
  /** (string) Appended to the className of the tooltip */
  tooltipClass?: string
}

export const Tooltip: React.FC<ITooltipProps> = props => {
  const {tooltip, children, ariaLabel, ariaHideTooltip, retain, position, customPosition, displayNone, tooltipWrapperClass, tooltipChildrenClass, tooltipClass} = props
  const defaultPositions: ITooltipPositionPriority = ["right", "left", "bottom", "top", "fixed", "hidden"]
  const tooltipElement = React.useRef<HTMLDivElement>(null)
  const [currentPosition, setCurrentPosition] = React.useState(0) // Index in position priority array currently being used

  // Creates full position priority array, by taking user specified positions, & adding unspecified positions onto the end
  const normalisePositionPriority = React.useCallback((positions: ITooltipPositions): ITooltipPositionPriority => {
    const positionsArray: ITooltipPosition[] = typeof positions === "string" ? [positions] : positions
    const uniquePositions: ITooltipPosition[] = _.uniq(positionsArray)
    const unsetPositions: ITooltipPosition[] = _.difference(defaultPositions, uniquePositions)
    return [...uniquePositions, ...unsetPositions] as ITooltipPositionPriority
  }, [])

  // Uses customPosition if passed in, otherwise gets normalised position priority
  const positionPriority = React.useMemo(() => {
    switch (typeof customPosition) {
      case "string":
        return [customPosition]
      case "object":
        return customPosition
      case "undefined":
        return normalisePositionPriority(position)
    }
  }, [position])

  // Checks if an element is fully within the viewport
  const isInViewport = React.useCallback((element: Element): boolean => {
    const bounding = element.getBoundingClientRect()
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth
    const viewportHeight = document.documentElement.clientHeight || window.innerHeight
    return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.right <= viewportWidth &&
      bounding.bottom <= viewportHeight
    )
  }, [])

  // Determines aria-label for children props.
  const actualAriaLabel = React.useMemo(() => {
    if (ariaLabel) {
      return ariaLabel
    } else if (typeof tooltip === "string") {
      return tooltip
    } else {
      return ""
    }
  }, [ariaLabel])

  // If current tooltip position is not visible, moves on to next position, unless already on last position
  React.useEffect(() => {
    if (tooltipElement.current && currentPosition + 1 < positionPriority.length && (currentPosition < 0 || !isInViewport(tooltipElement.current))) {
      setCurrentPosition(currentPosition + 1)
    }
  }, [tooltipElement, currentPosition])

  return (
    // currentPosition set to -1, as setting to 0 doesn't trigger useEffect when it's already 0
    <div className={"tooltip-wrapper " + (tooltipWrapperClass ? tooltipWrapperClass : "")} onMouseEnter={() => setCurrentPosition(-1)}>
      <div className={"tooltip-children " + (tooltipChildrenClass ? tooltipChildrenClass : "")} aria-label={actualAriaLabel}>
        {children}
      </div>
      <div className={"tooltip " + (tooltipClass ? tooltipClass : "")}
        ref={tooltipElement}
        aria-hidden={ariaHideTooltip}
        data-retain={!!retain}
        data-position={positionPriority[currentPosition] ? positionPriority[currentPosition] : "hidden"}
        data-display-none={displayNone}
      >
        {tooltip}
      </div>
    </div>
  )
}

Tooltip.defaultProps = {
  ariaHideTooltip: true,
  retain: false,
  position: ["right", "left", "bottom", "top", "fixed", "hidden"],
  displayNone: false
}
