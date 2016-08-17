import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from "underscore";
import * as classNames from "classnames";
import { LayoutHelpers, MarginClass, PaddingClass, BgColorClass, FgColorClass, VerticalAlignment, HorizontalAlignment } from "./../../utilities/uiHelpers";

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
}

export class Grid extends React.Component<IGrid, {}> {
  render() {
    const originalClassName = this.props.className;
    const attrs = _.omit(this.props, "className", "debugMode", "disableFlexOverride", "fillContainer");
    const classes = classNames(
      originalClassName,
      "grid",
      {
        "fill-container": this.props.fillContainer,
        "grid-debug": this.props.debugMode,
        "table-grid": this.props.table
      }
    );
    if (this.props.fillContainer && !this.props.disableFlexOverride){
      return (<div className="flex-override"><div {...attrs} className={classes} /></div>);
    }
    else{
      return (<div {...attrs} className={classes} />);
    }
  }
  componentDidMount(){
    if (this.props.fillContainer && !this.props.disableFlexOverride){
      (ReactDOM.findDOMNode(this).parentElement as HTMLElement).style.position = "relative";
    }
  }
}

export interface IRow extends React.HTMLProps<Row> {
  /** (number | string) Sets a fixed height for the row, or 'auto' to grow to fit its content */
  height?: number | "auto";
  /** (string) CSS classname property */
  className?: string | MarginClass | PaddingClass | BgColorClass | FgColorClass;
}

export class Row extends React.Component<IRow, any> {
  render() {
    var attrs = _.omit(this.props, "className", "height");
    var classes = classNames(this.props.className, "row", this.props.height ? "no-flex" : "");
    var styles = this.props.style;
    var colStyles;

    if (typeof this.props.height === "number") {
      styles = _.extend({ maxHeight: `${this.props.height}px`, height: "100%" }, styles);
    }

    return <div {...attrs} className={classes} style={styles}>
      {
        React.Children.map(this.props.children, (c: any) => {
          return c ? React.cloneElement((c as React.ReactElement<any>), { style: colStyles ? _.extend(colStyles, c.props.style) : c.props.style }) : null
        })
      }
    </div>
  }
}

export interface ICol extends React.HTMLProps<Col> {
  /** (HorizontalAlignment(string)) How to align content horizontally in this column */
  horizontalAlignment?: HorizontalAlignment;
  /** (HorizontalAlignment(string)) How to align content vertically in this column */
  verticalAlignment?: VerticalAlignment;
  /** (number | string) Sets a fixed width for the column, or 'auto' to grow to fit its content */
  width?: number | "auto";
  /** (string) CSS classname property */
  className?: string | MarginClass | PaddingClass | BgColorClass | FgColorClass;
}

export class Col extends React.Component<ICol, {}> {
  render() {
    const alignmentClasses = LayoutHelpers.GetAlignmentClasses(this.props.verticalAlignment, this.props.horizontalAlignment);
    const classes = classNames(
      "col",
      this.props.className,
      alignmentClasses,
      {
        "no-flex" : this.props.width !== undefined,
      }
    );

    const attrs = _.omit(this.props, "className", "width", "horizontalAlignment", "verticalAlignment");
    let styles = this.props.style;

    if (typeof this.props.width === "number") {
      styles = _.extend({ maxWidth: `${this.props.width}px`, width: "100%" }, styles);
    }

    return <div {...attrs} className={classes} style={styles} />
  }
}