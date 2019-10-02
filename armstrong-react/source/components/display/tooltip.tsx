import * as React from "react";
import _ = require('underscore');

type Position = "left" | "right" | "top" | "bottom" | "fixed" | "hidden"

type Positions = Position | Position[]

type PositionPriority = [Position, Position, Position, Position, Position, Position]

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
  /** (Position) Priority order, or just top priority, for tooltip location, default ["right", "left", "bottom", "top", "fixed", "hidden"] */
  position?: Positions
}

export const Tooltip: React.FC<ITooltipProps> = props => {
  const {tooltip, children, ariaLabel, ariaHideTooltip, retain, position} = props
  const defaultPositions: PositionPriority = ["right", "left", "bottom", "top", "fixed", "hidden"]
  const tooltipElement = React.useRef<HTMLDivElement>(null)
  const [currentPosition, setCurrentPosition] = React.useState(0) // Index in position priority array currently being used

  // Creates full position priority array, by taking user specified positions, & adding unspecified positions onto the end
  const normalisePositionPriority = React.useCallback((positions: Positions): PositionPriority => {
    const positionsArray: Position[] = typeof positions === "string" ? [positions] : positions
    const uniquePositions: Position[] = _.uniq(positionsArray)
    const unsetPositions: Position[] = _.difference(defaultPositions, uniquePositions)
    return [...uniquePositions, ...unsetPositions] as PositionPriority
  }, [])

  // Uses default postion priority array, if no position prop is passed
  const positionPriority = React.useMemo(() => {
    return position ? normalisePositionPriority(position) : defaultPositions
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

  // Determines if tooltip should be aria-hidden
  const ariaHidden = React.useMemo(() => {
    if (typeof ariaHideTooltip === "boolean") {
      return ariaHideTooltip
    } else {
      return true
    }
  }, [ariaHideTooltip])

  // If current tooltip position is not visible, moves on to next position
  React.useEffect(() => {
    if (tooltipElement.current && currentPosition < 5 && (currentPosition < 0 || !isInViewport(tooltipElement.current))) {
      setCurrentPosition(currentPosition + 1)
    }
  }, [tooltipElement, currentPosition])

  return (
    // currentPosition set to -1, as setting to 0 doesn't trigger useEffect when it's already 0
    <div className="tooltip-wrapper" onMouseEnter={() => setCurrentPosition(-1)}>
      <div className="tooltip-children" aria-label={actualAriaLabel}>
        {children}
      </div>
      <div className="tooltip"
        ref={tooltipElement}
        aria-hidden={ariaHidden}
        data-retain={!!retain}
        data-position={positionPriority[currentPosition] ? positionPriority[currentPosition] : "hidden"}
      >
        {tooltip}
      </div>
    </div>
  )
}
