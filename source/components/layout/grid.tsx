import * as React from "react";
import * as _ from "underscore";
import { classNames, cd } from "./../../utilities/classBuilder";
import { Spacing, LayoutProps, LayoutHelpers, DisplayProps, CenterContent, CenterBoth, Responsiveness } from "./../../utilities/uiHelpers";

export interface IGrid extends React.Props<Grid>, LayoutProps, DisplayProps {
  debugMode?: boolean;
  responsive?: Responsiveness;
  className?: string;
  table?: boolean;
}

export class Grid extends React.Component<IGrid, any> {
  static defaultProps = {
    responsive: "both"
  }
  render() {
    var responsiveClasses = LayoutHelpers.HandleResponsivenessClasses(this.props.responsive);
    var layoutClasses = LayoutHelpers.HandleLayoutClasses(this.props.margin, this.props.padding);
    var displayClasses = LayoutHelpers.HandleDisplayClasses(this.props.background, this.props.foreground);
    var displayStyles = LayoutHelpers.HandleDisplayStyles(this.props.background, this.props.foreground);

    var originalClassName = this.props.className;
    var attrs = _.omit(this.props, "className");
    var classes = classNames(originalClassName, "grid", "fill-container", responsiveClasses, cd("grid-debug", this.props.debugMode), cd("table-grid", this.props.table), displayClasses, layoutClasses);

    return (<div {...attrs} className={classes} style={displayStyles} />);
  }
}

export interface IColRow extends IRow {
  centerContent?: CenterContent | CenterBoth;
}

export interface IRow extends React.HTMLProps<Row>, LayoutProps, DisplayProps {
  fixed?: boolean | number;
}

export class Row extends React.Component<IRow, any> {
  render() {
    var layoutClasses = LayoutHelpers.HandleLayoutClasses(this.props.margin, this.props.padding);
    var displayClasses = LayoutHelpers.HandleDisplayClasses(this.props.background, this.props.foreground);
    var displayStyles = LayoutHelpers.HandleDisplayStyles(this.props.background, this.props.foreground);

    var attrs = _.omit(this.props, "className", "fixed");
    var classes = classNames(this.props.className, "row", cd("no-flex", !!this.props.fixed), displayClasses, layoutClasses);

    if (typeof this.props.fixed === "number") {
      displayStyles = _.extend({ maxHeight: `${this.props.fixed}px`, height: "100%" }, displayStyles);
    }

    return <div {...attrs} className={classes} style={displayStyles}/>
  }
}



export interface ICol extends React.HTMLProps<Col>, LayoutProps, DisplayProps {
  centerContent?: CenterContent | CenterBoth;
  spans?: number;
  fixed?: boolean | number;
}

/**
Represents a Column of a Row in the Grid Layout system
*/
export class Col extends React.Component<ICol, {}> {
  render() {
    var layoutClasses = LayoutHelpers.HandleLayoutClasses(this.props.margin, this.props.padding);
    var displayClasses = LayoutHelpers.HandleDisplayClasses(this.props.background, this.props.foreground);
    var displayStyles = LayoutHelpers.HandleDisplayStyles(this.props.background, this.props.foreground);
    var centerClasses = LayoutHelpers.GetAlignment(this.props.centerContent);

    var classes = classNames("col", this.props.className, cd("no-flex", this.props.fixed !== undefined), cd(`col${this.props.spans}`, this.props.spans !== undefined), displayClasses, layoutClasses, centerClasses)

    var attrs = _.omit(this.props, "fixed", "spans");

    if (typeof this.props.fixed === "number") {
      displayStyles = _.extend({ maxWidth: `${this.props.fixed}px`, width: "100%" }, displayStyles);
    }

    return <div {...attrs} className={classes} style={displayStyles} />
  }
}

export class SingleColumnRow extends React.Component<IColRow, any> {
  render() {
    var layoutClasses = LayoutHelpers.HandleLayoutClasses(this.props.margin, this.props.padding);
    var displayClasses = LayoutHelpers.HandleDisplayClasses(this.props.background, this.props.foreground);
    var displayStyles = LayoutHelpers.HandleDisplayStyles(this.props.background, this.props.foreground);
    var centerClasses = LayoutHelpers.GetAlignment(this.props.centerContent);

    var classes = classNames("row", cd("no-flex", this.props.fixed !== undefined), this.props.className, displayClasses, layoutClasses);

    return (
      <div {...this.props as any} className={classes} style={displayStyles}>
        <div className={classNames('col', centerClasses)}>{this.props.children}</div>
      </div>)
  }
}

export class FixedCentralColumnRow extends React.Component<IColRow, any> {
  render() {
    var layoutClasses = LayoutHelpers.HandleLayoutClasses(this.props.margin, this.props.padding);
    var displayClasses = LayoutHelpers.HandleDisplayClasses(this.props.background, this.props.foreground);
    var displayStyles = LayoutHelpers.HandleDisplayStyles(this.props.background, this.props.foreground);
    var centerClasses = LayoutHelpers.GetAlignment(this.props.centerContent);

    var classes = classNames("row", "fixed-central-col-row", cd("no-flex", this.props.fixed !== undefined), this.props.className, displayClasses, layoutClasses);

    return (
      <div {...this.props as any} className={classes} style={displayStyles}>
        <div className={classNames('col', 'fixed-central-col', centerClasses)}>{this.props.children}</div>
      </div>)
  }
}
