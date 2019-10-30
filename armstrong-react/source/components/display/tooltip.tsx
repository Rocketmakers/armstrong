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
  /** (boolean) Retain tooltip when tooltip is hovered, default false */
  retain?: boolean
  /** (boolean) Never show tooltip, default false */
  disable?: boolean
  /** (Position) Priority order, or just top priority, for tooltip location, default ["right", "left", "bottom", "top", "fixed", "hidden"].  Only for use with preset positions, & appends unspecified positions to user defined list. */
  position?: ITooltipPositions
  /** (ITooltipCustomPositions) Priority order, or just top priority, for tooltip location.  Overrides position prop.  Can use custom user positions created in css, & preset positions. */
  customPosition?: ITooltipCustomPositions
  /** (HtmlAttributes) HTML attributes of the tooltip wrapper */
  wrapperAttributes?: React.HTMLAttributes<HTMLElement>
  /** (HtmlAttributes) HTML attributes of the tooltip children */
  childrenAttributes?: React.HTMLAttributes<HTMLElement>
  /** (HtmlAttributes) HTML attributes of the tooltip */
  tooltipAttributes?: React.HTMLAttributes<HTMLElement>
}

export const Tooltip: React.FC<ITooltipProps> = props => {

  const {tooltip, children, retain, disable, position, customPosition, wrapperAttributes, childrenAttributes, tooltipAttributes} = props
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

  // If current tooltip position is not visible, moves on to next position, unless already on last position
  React.useEffect(() => {
    if (tooltipElement.current && currentPosition + 1 < positionPriority.length && (currentPosition < 0 || !isInViewport(tooltipElement.current))) {
      setCurrentPosition(currentPosition + 1)
    }
  }, [tooltipElement, currentPosition])

  // Appends default classes, & applies tooltip as aria-label to children
  const createAttributes = React.useCallback((attributes: React.HTMLAttributes<HTMLElement>, className: string): React.HTMLAttributes<HTMLElement> => {
    const attr = Object.assign({}, attributes)
    attr.className = (attr.className ? attr.className : "") + " " + className
    if (className === "tooltip-children" && !attr["aria-label"] && typeof tooltip === "string") {
      attr["aria-label"] = tooltip
    }
    return attr
  }, [])

  const wrapperAttr = React.useMemo(() => createAttributes(wrapperAttributes, "tooltip-wrapper"), [wrapperAttributes])
  const childrenAttr = React.useMemo(() => createAttributes(childrenAttributes, "tooltip-children"), [childrenAttributes])
  const tooltipAttr = React.useMemo(() => createAttributes(tooltipAttributes, "tooltip"), [tooltipAttributes])

  return (
    // currentPosition set to -1, as setting to 0 doesn't trigger useEffect when it's already 0
    <div {...wrapperAttr} onMouseEnter={() => setCurrentPosition(-1)}>
      <div {...childrenAttr}>
        {children}
      </div>
      <div {...tooltipAttr}
        ref={tooltipElement}
        data-retain={retain}
        data-position={positionPriority[currentPosition] && !disable ? positionPriority[currentPosition] : "hidden"}>
        {tooltip}
      </div>
    </div>
  )
}

Tooltip.defaultProps = {
  retain: false,
  disable: false,
  position: ["right", "left", "bottom", "top", "fixed", "hidden"],
  wrapperAttributes: {},
  childrenAttributes: {},
  tooltipAttributes: {}
}
