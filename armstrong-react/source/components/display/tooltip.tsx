import * as React from "react";
import { CSSProperties } from "react";
import _ = require("underscore");

export type ITooltipPosition = "left" | "right" | "top" | "bottom" | "fixed" | "hidden";

export type ITooltipPositions = ITooltipPosition | ITooltipPosition[];

export type ITooltipCustomPositions = string | string[];

export type ITooltipPositionPriority = [
  ITooltipPosition,
  ITooltipPosition,
  ITooltipPosition,
  ITooltipPosition,
  ITooltipPosition,
  ITooltipPosition
];

export interface ITooltipProps {
  /** (JSX.Element | string) The content to appear on hover.  Passing a string will apply it as an aria-label to children, if ariaLabel not passed */
  tooltip: JSX.Element | string;
  /** (JSX.Element) The content that causes the tooltip to appear when hovered. */
  children: JSX.Element;
  /** (boolean) Retain tooltip when tooltip is hovered, default false */
  retain?: boolean;
  /** (boolean) Never show tooltip, default false */
  disable?: boolean;
  /** (Position) Priority order, or just top priority, for tooltip location, default ["right", "left", "bottom", "top", "fixed", "hidden"].  Only for use with preset positions, & appends unspecified positions to user defined list. */
  position?: ITooltipPositions;
  /** (ITooltipCustomPositions) Priority order, or just top priority, for tooltip location.  Overrides position prop.  Can use custom user positions created in css, & preset positions. */
  customPosition?: ITooltipCustomPositions;
  /** (boolean) When true, uses display rather than opacity to show/hide the tooltip, default false */
  displayNone?: boolean;
  /** (HtmlAttributes) HTML attributes of the tooltip wrapper */
  wrapperAttributes?: React.HTMLAttributes<HTMLElement>;
  /** (HtmlAttributes) HTML attributes of the tooltip children */
  childrenAttributes?: React.HTMLAttributes<HTMLElement>;
  /** (HtmlAttributes) HTML attributes of the tooltip */
  tooltipAttributes?: React.HTMLAttributes<HTMLElement>;
  /** (boolean) centers the tooltip */
  center?: boolean;
  /** (boolean) shows an arrow pointing to the child element */
  withArrow?: boolean;
}

export const Tooltip: React.FC<ITooltipProps> = props => {
  const {
    tooltip,
    children,
    retain,
    disable,
    position,
    customPosition,
    displayNone,
    wrapperAttributes,
    childrenAttributes,
    tooltipAttributes,
    center,
    withArrow
  } = props;
  const defaultPositions: ITooltipPositionPriority = ["right", "left", "bottom", "top", "fixed", "hidden"];
  const tooltipElement = React.useRef<HTMLDivElement>(null);
  const tooltipChildrenElement = React.useRef<HTMLDivElement>(null);
  const [currentPosition, setCurrentPosition] = React.useState(0); // Index in position priority array currently being used

  // Creates full position priority array, by taking user specified positions, & adding unspecified positions onto the end
  const normalisePositionPriority = React.useCallback((positions: ITooltipPositions): ITooltipPositionPriority => {
    const positionsArray: ITooltipPosition[] = typeof positions === "string" ? [positions] : positions;
    const uniquePositions: ITooltipPosition[] = _.uniq(positionsArray);
    const unsetPositions: ITooltipPosition[] = _.difference(defaultPositions, uniquePositions);
    return [...uniquePositions, ...unsetPositions] as ITooltipPositionPriority;
  }, []);

  // Uses customPosition if passed in, otherwise gets normalised position priority
  const positionPriority = React.useMemo(() => {
    switch (typeof customPosition) {
      case "string":
        return [customPosition];
      case "object":
        return customPosition;
      case "undefined":
        return normalisePositionPriority(position);
    }
  }, [position]);

  // Checks if an element is fully within the viewport
  const isInViewport = React.useCallback((element: Element): boolean => {
    const bounding = element.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
    return bounding.top >= 0 && bounding.left >= 0 && bounding.right <= viewportWidth && bounding.bottom <= viewportHeight;
  }, []);

  // If current tooltip position is not visible, moves on to next position, unless already on last position
  React.useEffect(() => {
    if (
      tooltipElement.current &&
      currentPosition + 1 < positionPriority.length &&
      (currentPosition < 0 || !isInViewport(tooltipElement.current))
    ) {
      setCurrentPosition(currentPosition + 1);
    } else if (retain) {
      updateBridgeStyle();
    }
  }, [tooltipElement, currentPosition]);

  // Appends default classes, & applies tooltip as aria-label to children
  const createAttributes = React.useCallback((attributes: React.HTMLAttributes<HTMLElement>, className: string): React.HTMLAttributes<
    HTMLElement
  > => {
    const attr = Object.assign({}, attributes);
    attr.className = (attr.className ? attr.className : "") + " " + className;
    if (className === "tooltip-children" && !attr["aria-label"] && typeof tooltip === "string") {
      attr["aria-label"] = tooltip;
    }
    return attr;
  }, []);

  const [bridgeStyle, setBridgeStyle] = React.useState<CSSProperties>({});

  // Calculates bridge size and position to detect hover when mouse is between tooltip & tooltipChildren
  // tX, tY, tW, tH are tooltip x, y, width, height
  // cX, cY, cW, cH are tooltipChildren x, y, width, height
  // above, left, below, right are true if there is a gap between tooltip & tooltipChildren in that direction
  const updateBridgeStyle = React.useCallback((): void => {
    if (tooltipElement.current && tooltipChildrenElement.current) {
      const { x: tX, y: tY, width: tW, height: tH } = tooltipElement.current.getBoundingClientRect() as DOMRect;
      const { x: cX, y: cY, width: cW, height: cH } = tooltipChildrenElement.current.getBoundingClientRect() as DOMRect;
      const above = tY + tH < cY;
      const left = tX + tW < cX;
      const below = tY > cH + cY;
      const right = tX > cW + cX;

      // Only continue if tooltip & tooltipChildren overlap on 1 axis only
      if ([above, left, below, right].filter(Boolean).length !== 1) {
        setBridgeStyle(undefined);
        return;
      }
      const style: CSSProperties = {};

      // When above or below, bridge width extends to furthest edges of tooltip & tooltipChildren, & height is the gap between them.
      if (above || below) {
        if (tX < cX) {
          style.left = tX - cX;
          if (tX + tW < cX + cW) {
            style.width = cX + cW - tX;
          } else {
            style.width = tW;
          }
        } else {
          style.left = 0;
          if (tX + tW < cX + cW) {
            style.width = cW;
          } else {
            style.width = tW + tX - cX;
          }
        }
      }
      if (above) {
        style.height = cY - tY - tH;
        style.top = tH + tY - cY;
      }
      if (below) {
        style.height = tY - cY - cH;
        style.top = cH;
      }

      // When left or right, bridge height extends to furthest edges of tooltip & tooltipChildren, & width is the gap between them.
      if (left || right) {
        if (tY < cY) {
          style.top = tY - cY;
          if (tY + tH < cY + cH) {
            style.height = cY + cH - tY;
          } else {
            style.height = tH;
          }
        } else {
          style.top = 0;
          if (tY + tH < cY + cH) {
            style.height = cH;
          } else {
            style.height = tH + tY - cY;
          }
        }
      }
      if (left) {
        style.width = cX - tX - tW;
        style.left = tW + tX - cX;
      }
      if (right) {
        style.width = tX - cX - cW;
        style.left = cW;
      }

      Object.entries(style).forEach(property => {
        style[property[0]] = property[1] + "px";
      });
      setBridgeStyle(style);
    }
  }, [tooltipElement.current, tooltipChildrenElement.current]);

  const wrapperAttr = React.useMemo(() => createAttributes(wrapperAttributes, "tooltip-wrapper"), [wrapperAttributes]);
  const childrenAttr = React.useMemo(() => createAttributes(childrenAttributes, "tooltip-children"), [childrenAttributes]);
  const tooltipAttr = React.useMemo(() => createAttributes(tooltipAttributes, "tooltip"), [tooltipAttributes]);

  return (
    // currentPosition set to -1, as setting to 0 doesn't trigger useEffect when it's already 0
    <div {...wrapperAttr} onMouseEnter={() => setCurrentPosition(-1)}>
      <div {...childrenAttr} ref={tooltipChildrenElement}>
        {children}
      </div>
      {retain && (
        <div
          className="bridge"
          data-position={positionPriority[currentPosition] && !disable ? positionPriority[currentPosition] : "hidden"}
          style={bridgeStyle}
        ></div>
      )}
      <div
        {...tooltipAttr}
        ref={tooltipElement}
        data-retain={retain}
        data-center={center}
        data-arrow={withArrow}
        data-position={positionPriority[currentPosition] && !disable ? positionPriority[currentPosition] : "hidden"}
        data-display-none={displayNone}
      >
        {tooltip}
      </div>
    </div>
  );
};

Tooltip.defaultProps = {
  retain: false,
  disable: false,
  center: true,
  withArrow: true,
  position: ["top", "right", "left", "bottom", "fixed", "hidden"],
  displayNone: false,
  wrapperAttributes: {},
  childrenAttributes: {},
  tooltipAttributes: {}
};
