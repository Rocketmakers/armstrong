import * as React from "react";
import { ClassHelpers } from "../../utilities/classHelpers";
import { HorizontalAlignment, LayoutHelpers, VerticalAlignment } from "../../utilities/layoutHelpers";

function sizeErrorMessage(size: string, sizeValue: string, controlPath: string) {
  return `Unsupported ${size} property '${sizeValue}' on ${controlPath}. If you are using a string, make sure it is either 'auto' or follows the pattern '[number]*'`
}

export interface IGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** (boolean) Wether to render borders around grid parts */
  debugMode?: boolean;
  /** (string) CSS className property */
  className?: string;
  /** (boolean) Wether the table should expand and divide to fill its container */
  fillContainer?: boolean;
  /** (string) An HTML tag to use for the root element instead of <div> */
  tagName?: keyof React.ReactHTML;
  /** (Row[]) A row must contain one or many <Row/> elements */
  children?: React.ReactElement<IRowProps> | Array<React.ReactElement<IRowProps>>;
}

export const GridRef: React.RefForwardingComponent<{}, IGridProps> = (props, ref) => {
  const { className, debugMode, fillContainer, tagName, ...attrs } = props;

  const grid = React.useRef<HTMLElement>(undefined);
  const refCallback = React.useCallback<() => {}>(() => {
    return grid.current
  }, [grid])

  React.useImperativeHandle(ref, refCallback, [refCallback])

  const classes = React.useMemo(() => ClassHelpers.classNames(
    className,
    "grid",
    {
      "fill-container": fillContainer,
      "grid-debug": debugMode,
    },
  ), [className, fillContainer, debugMode]);

  return React.createElement(tagName, { ...attrs, ref: grid, className: classes })
}

export const Grid = React.forwardRef(GridRef)

Grid.defaultProps = {
  tagName: "div" as any,
}

export interface IRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** (number | string) Sets a fixed height for the row, or 'auto' to grow to fit its content */
  height?: number | string;
  /** (string) CSS className property */
  className?: string;
  /** (string) An HTML tag to use for the root element instead of <div> */
  tagName?: string;
  /** (Col[]) A row must contain one or many <Col/> elements */
  children?: React.ReactElement<IColProps> | Array<React.ReactElement<IColProps>>;
}

function needsFixedHeight(height: string | number) {
  if (!height) {
    return false;
  }

  if (typeof height === "number") {
    return true
  }

  if (height === "auto") {
    return true;
  }

  return false;
}

export const Row: React.FC<IRowProps> = props => {

  const { className, height, tagName, style, ...attrs } = props;
  const classes = React.useMemo(() => ClassHelpers.classNames(className, "row", needsFixedHeight(height) ? "no-flex" : ""), [className, height]);
  const styles = React.useMemo(() => {
    if (height) {
      if (typeof height === "number") {
        return { height: `${height}px`, ...style };
      }
      if (height === "auto") {
        return style
      }

      const starIndex = height.indexOf("*");
      if (starIndex !== -1 && parseFloat(height)) {
        const spans = height.substr(0, starIndex);
        return { flex: `${spans}`, ...style };
      }

      // tslint:disable-next-line:no-console
      console.error(sizeErrorMessage("height", height, "Grid > Row"))
    }
  }, [style, height])

  return React.createElement(tagName, { ...attrs, className: classes, style: styles },
    React.Children.map(props.children, (c: React.ReactElement<any>) => {
      return c ? React.cloneElement(c, { style: c.props.style }) : null
    }),
  )
}

Row.defaultProps = {
  tagName: "div",
}

export interface IColProps extends React.HTMLAttributes<HTMLDivElement> {
  /** (HorizontalAlignment(string)) How to align content horizontally in this column */
  horizontalAlignment?: HorizontalAlignment;
  /** (HorizontalAlignment(string)) How to align content vertically in this column */
  verticalAlignment?: VerticalAlignment;
  /** (number | string) Sets a fixed width for the column, or 'auto' to grow to fit its content */
  width?: number | string;
  /** (string) An HTML tag to use for the root element instead of <div> */
  tagName?: string;
  /** (string) CSS className property */
  className?: string;
}

function needsFixedWidth(width: string | number) {
  if (!width) {
    return false;
  }

  if (typeof width === "number") {
    return true
  }

  if (width === "auto") {
    return true;
  }

  return false;
}

export const Col: React.FC<IColProps> = props => {
  const { className, width, horizontalAlignment, verticalAlignment, tagName, style, ...attrs } = props
  const alignmentClasses = React.useMemo(() => LayoutHelpers.GetAlignmentClasses(verticalAlignment, horizontalAlignment), [verticalAlignment, horizontalAlignment]);
  const classes = React.useMemo(() => ClassHelpers.classNames(
    "col",
    className,
    alignmentClasses,
    {
      "no-flex": needsFixedWidth(width),
    },
  ), [className, alignmentClasses, width]);

  const styles = React.useMemo<React.CSSProperties>(() => {
    if (width) {
      if (typeof width === "number") {
        return { maxWidth: `${width}px`, width: "100%", ...style };
      }

      if (width === "auto") {
        return style
      }

      const starIndex = width.indexOf("*");
      if (starIndex !== -1 && parseFloat(width)) {
        const spans = width.substr(0, starIndex);
        return { flex: `${spans}`, ...style };
      }
      // tslint:disable-next-line:no-console
      console.error(sizeErrorMessage("width", width, "Grid > Row > Col"))
    }

    if (typeof width === "number") {
      return { maxWidth: `${width}px`, width: "100%", ...style };
    }
    return style
  }, [style, width])

  return React.createElement(tagName, { ...attrs, className: classes, style: styles })
}

Col.defaultProps = {
  tagName: "div",
}
