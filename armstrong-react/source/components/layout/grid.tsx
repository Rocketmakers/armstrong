import * as React from "react";
import * as _ from "underscore";
import { ClassHelpers } from "../../utilities/classHelpers";
import { HorizontalAlignment, VerticalAlignment, LayoutHelpers } from "../../utilities/layoutHelpers";

function sizeErrorMessage(size: string, sizeValue: string, controlPath: string) {
  return `Unsupported ${size} property '${sizeValue}' on ${controlPath}. If you are using a string, make sure it is either 'auto' or follows the pattern '[number]*'`
}

export interface IGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** (boolean) Wether to render borders around grid parts */
  debugMode?: boolean;
  /** (string) CSS classname property */
  className?: string;
  /** (boolean) Wether the table should expand and divide to fill its container */
  fillContainer?: boolean;
  /** (string) An HTML tag to use for the root element instead of <div> */
  tagName?: keyof React.ReactHTML;
  /** (Col[]) A row must contain one or many <Col/> elements */
  children?: React.ReactNode;
}

export function Grid(props: IGridProps) {
  const originalClassName = props.className;
  const { className, debugMode, fillContainer, tagName, ...attrs } = props;
  const classes = ClassHelpers.classNames(
    originalClassName,
    "grid",
    {
      "fill-container": fillContainer,
      "grid-debug": debugMode
    },
  );
  return React.createElement(tagName || "div", { ...attrs, className: classes })
}

export interface IRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** (number | string) Sets a fixed height for the row, or 'auto' to grow to fit its content */
  height?: number | string;
  /** (string) CSS classname property */
  className?: string;
  /** (string) An HTML tag to use for the root element instead of <div> */
  tagName?: string;
  /** (Col[]) A row must contain one or many <Col/> elements */
  children?: React.ReactNode;
}

export function Row(props: IRowProps) {

  function needsFixed() {
    if (!height) {
      return false;
    }
    if (typeof height === "number") {
      return true
    } else {
      if (height === "auto") {
        return true;
      }
    }
    return false;
  }

  const { className, height, tagName, style, ...attrs } = props;
  const classes = ClassHelpers.classNames(className, "row", needsFixed() ? "no-flex" : "");
  let styles = style;

  if (height) {
    if (typeof height === "number") {
      styles = _.extend({ height: `${height}px` }, styles);
    } else {
      const hString = (height as string);
      const starIndex = hString.indexOf("*");
      if (height === "auto") {
        // do nothing
      } else if (starIndex !== -1 && parseFloat(hString)) {
        const spans = (height as string).substr(0, starIndex);
        styles = _.extend({ flex: `${spans}` }, styles);
      } else {
        // tslint:disable-next-line:no-console
        console.error(sizeErrorMessage("height", height, "Grid > Row"))
      }
    }
  }

  return React.createElement(tagName || "div", { ...attrs, className: classes, style: styles },
    React.Children.map(props.children, (c: React.ReactElement<any>) => {
      return c ? React.cloneElement(c, { style: c.props.style }) : null
    }),
  )
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
  /** (string) CSS classname property */
  className?: string;
}

export function Col(props: IColProps) {
  const { className, width, horizontalAlignment, verticalAlignment, tagName, style, ...attrs } = props
  function needsFixed() {
    if (!width) {
      return false;
    }
    if (typeof width === "number") {
      return true
    } else {
      if (width === "auto") {
        return true;
      }
    }
    return false;
  }
  const alignmentClasses = LayoutHelpers.GetAlignmentClasses(verticalAlignment, horizontalAlignment);
  const classes = ClassHelpers.classNames(
    "col",
    className,
    alignmentClasses,
    {
      "no-flex": needsFixed(),
    },
  );

  let styles = style;

  if (width) {
    if (typeof width === "number") {
      styles = _.extend({ maxwidth: `${width}px`, width: "100%" }, styles);
    } else {
      const wString = (width as string);
      const starIndex = wString.indexOf("*");
      if (width === "auto") {
        // do nothing
      } else if (starIndex !== -1 && parseFloat(wString)) {
        const spans = wString.substr(0, starIndex);
        styles = _.extend({ flex: `${spans}` }, styles);
      } else {
        // tslint:disable-next-line:no-console
        console.error(sizeErrorMessage("width", width, "Grid > Row > Col"))
      }
    }
  }

  if (typeof width === "number") {
    styles = _.extend({ maxWidth: `${width}px`, width: "100%" }, styles);
  }

  return React.createElement(tagName || "div", { ...attrs, className: classes, style: styles })
}