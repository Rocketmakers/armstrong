import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from "underscore";
import * as classNames from "classnames";
import { LayoutHelpers, CenterContent, CenterBoth, MarginClass, PaddingClass, BgColorClass, FgColorClass } from "./../../utilities/uiHelpers";

export interface IGrid extends React.Props<Grid>, React.HTMLProps<Grid> {
  debugMode?: boolean;
  disableFlexOverride?: boolean;
  className?: string | MarginClass | PaddingClass | BgColorClass | FgColorClass;
  table?: boolean;
  fillContainer?: boolean;
}

export class Grid extends React.Component<IGrid, any> {
  render() {
    const originalClassName = this.props.className;
    const attrs = _.omit(this.props, "className", "debugMode", "table", "fillContainer");
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

export interface IColRow extends IRow {
  centerContent?: CenterContent | CenterBoth;
  className?: string | MarginClass | PaddingClass | BgColorClass | FgColorClass;
}

export interface IRow extends React.HTMLProps<Row> {
  fixed?: boolean | number;
  className?: string | MarginClass | PaddingClass | BgColorClass | FgColorClass;
  maxCols?: number;
}

export class Row extends React.Component<IRow, any> {
  render() {
    const attrs = _.omit(this.props, "className", "fixed", "maxCols", "centerContent");
    const classes = classNames(
      this.props.className,
      "row",
      {
        "no-flex": !!this.props.fixed,
        "wrap-row": !!this.props.maxCols
      }
    );
    let styles = this.props.style;
    let colStyles;

    if (typeof this.props.fixed === "number") {
      styles = _.extend({ height: `${this.props.fixed}px` }, styles);
    }

    if (this.props.maxCols) {
      colStyles = { flexBasis: `${100 / this.props.maxCols}%`, maxWidth: `${100 / this.props.maxCols}%` };
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
  centerContent?: CenterContent | CenterBoth;
  spans?: number;
  fixed?: boolean | number;
  className?: string | MarginClass | PaddingClass | BgColorClass | FgColorClass;
}

export class Col extends React.Component<ICol, {}> {
  render() {
    const centerClasses = LayoutHelpers.GetAlignment(this.props.centerContent);
    const classes = classNames(
      "col",
      this.props.className,
      centerClasses,
      {
        "no-flex": this.props.fixed !== undefined,
        [`col${this.props.spans}`]: this.props.spans !== undefined
      }
    );

    const attrs = _.omit(this.props, "className", "fixed", "spans", "centerContent");
    let styles = this.props.style;

    if (typeof this.props.fixed === "number") {
      styles = _.extend({ maxWidth: `${this.props.fixed}px`, width: "100%" }, styles);
    }

    return <div {...attrs} className={classes} style={styles} />
  }
}

export class SingleColumnRow extends React.Component<IColRow, any> {
  render() {
    const centerClasses = LayoutHelpers.GetAlignment(this.props.centerContent);
    const classes = classNames("row", this.props.className, { "no-flex": this.props.fixed !== undefined });
    const styles = this.props.style;
    const attrs = _.omit(this.props, "className", "fixed", "spans", "centerContent");

    return (
      <div {...attrs} className={classes}>
        <div className={classNames('col', centerClasses) }>{this.props.children}</div>
      </div>)
  }
}
