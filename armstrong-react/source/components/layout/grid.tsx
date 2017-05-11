import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from "underscore";
import { LayoutHelpers, MarginClass, PaddingClass, BgColorClass, FgColorClass, VerticalAlignment, HorizontalAlignment } from "./../../utilities/uiHelpers";
import { ClassHelpers } from "../../utilities/classNames";

export interface IGrid extends React.HTMLProps<Grid> {
  /** (boolean) Wether to render borders around grid parts */
  debugMode?: boolean;
  /** (boolean) ADVANCED: Turns of automatic fix of safari6 compat wrapper */
  disableFlexOverride?: boolean;
  /** (string) CSS classname property */
  className?: string | MarginClass | PaddingClass | BgColorClass | FgColorClass;
  /** (boolean) Render the first row to simulate a table header */
  table?: boolean;
  /** (boolean) Wether the table should expand and divide to fill its container */
  fillContainer?: boolean;
  /** (string) An HTML tag to use for the root element instead of <div> */
  tagName?: string;
  /** (Row[]) A grid must contain one or many <Row/> elements */
  children?: any[] | any;
}

export class Grid extends React.Component<IGrid, {}> {
  render() {
    const originalClassName = this.props.className;
    const attrs = _.omit(this.props, "className", "debugMode", "disableFlexOverride", "table", "fillContainer");
    const classes = ClassHelpers.classNames(
      originalClassName,
      "grid",
      {
        "fill-container": this.props.fillContainer,
        "grid-debug": this.props.debugMode,
        "table-grid": this.props.table
      }
    );
    if (this.props.fillContainer && !this.props.disableFlexOverride) {
      return React.createElement(this.props.tagName || "div", { className: "flex-override" }, <div {...attrs} className={classes} />)
    }
    else {
      return React.createElement(this.props.tagName || "div", { ...attrs, className: classes });
    }
  }
  componentDidMount() {
    if (this.props.fillContainer && !this.props.disableFlexOverride) {
      (ReactDOM.findDOMNode(this).parentElement as HTMLElement).style.position = "relative";
    }
  }
}

export interface IRow extends React.HTMLProps<Row> {
  /** (number | string) Sets a fixed height for the row, or 'auto' to grow to fit its content */
  height?: number | string;
  /** (string) CSS classname property */
  className?: string | MarginClass | PaddingClass | BgColorClass | FgColorClass;
  /** (string) An HTML tag to use for the root element instead of <div> */
  tagName?: string;
  /** (Col[]) A row must contain one or many <Col/> elements */
  children?: any[] | any;
}

export class Row extends React.Component<IRow, any> {
  private needsFixed() {
    if (!this.props.height) {
      return false;
    }
    if (typeof this.props.height === "number") {
      return true
    } else {
      if (this.props.height === "auto") {
        return true;
      }
    }
    return false;
  }
  render() {
    var attrs = _.omit(this.props, "className", "height");
    var classes = ClassHelpers.classNames(this.props.className, "row", this.needsFixed() ? "no-flex" : "");
    var styles = this.props.style;
    var colStyles;
    if (this.props.height) {
      if (typeof this.props.height === "number") {
        styles = _.extend({ height: `${this.props.height}px` }, styles);
      } else {
        let hString = (this.props.height as string);
        let starIndex = hString.indexOf('*');
        if (this.props.height === "auto") {

        }
        else if (starIndex !== -1 && parseFloat(hString)) {
          let hString = (this.props.height as string);
          var spans = hString.substr(0, starIndex);
          styles = _.extend({ flex: `${spans}` }, styles);
        }
        else {
          throw new Error(`Unsupported height property '${this.props.height}' on Grid Row. If you are using a string, make sure it is either 'auto' or follows the pattern '[number]*'`)
        }
      }
    }

    return React.createElement(this.props.tagName || "div", { ...attrs, className: classes, style: styles },
      React.Children.map(this.props.children, (c: any) => {
        return c ? React.cloneElement((c as React.ReactElement<any>), { style: colStyles ? _.extend(colStyles, c.props.style) : c.props.style }) : null
      })
    )
  }
}

export interface ICol extends React.HTMLProps<Col> {
  /** (HorizontalAlignment(string)) How to align content horizontally in this column */
  horizontalAlignment?: HorizontalAlignment;
  /** (HorizontalAlignment(string)) How to align content vertically in this column */
  verticalAlignment?: VerticalAlignment;
  /** (number | string) Sets a fixed width for the column, or 'auto' to grow to fit its content */
  width?: number | string;
  /** (string) An HTML tag to use for the root element instead of <div> */
  tagName?: string;
  /** (string) CSS classname property */
  className?: string | MarginClass | PaddingClass | BgColorClass | FgColorClass;
}

export class Col extends React.Component<ICol, {}> {
  needsFixed() {
    if (!this.props.width) {
      return false;
    }
    if (typeof this.props.width === "number") {
      return true
    } else {
      if (this.props.width === "auto") {
        return true;
      }
    }
    return false;
  }
  render() {
    const alignmentClasses = LayoutHelpers.GetAlignmentClasses(this.props.verticalAlignment, this.props.horizontalAlignment);
    const classes = ClassHelpers.classNames(
      "col",
      this.props.className,
      alignmentClasses,
      {
        "no-flex": this.needsFixed(),
      }
    );

    const attrs = _.omit(this.props, "className", "width", "horizontalAlignment", "verticalAlignment");
    let styles = this.props.style;


    if (this.props.width) {
      if (typeof this.props.width === "number") {
        styles = _.extend({ maxwidth: `${this.props.width}px`, width: "100%" }, styles);
      } else {
        let wString = (this.props.width as string);
        let starIndex = wString.indexOf('*');
        if (this.props.width === "auto") {

        }
        else if (starIndex !== -1 && parseFloat(wString)) {
          var spans = wString.substr(0, starIndex);
          styles = _.extend({ flex: `${spans}` }, styles);
        }
        else {
          throw new Error(`Unsupported width property '${this.props.width}' on Grid > Row > Col. If you are using a string, make sure it is either 'auto' or follows the pattern '[number]*'`)
        }
      }
    }


    if (typeof this.props.width === "number") {
      styles = _.extend({ maxWidth: `${this.props.width}px`, width: "100%" }, styles);
    }

    return React.createElement(this.props.tagName || "div", {...attrs, className: classes, style: styles})
  }
}