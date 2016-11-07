import * as React from "react";
import * as _ from "underscore";
import * as classNames from "classnames";
import { Icons } from "./../../utilities/icons";
import { Icon } from "./../display/icon";

export interface ITabControlProps extends React.HTMLProps<TabControl> {
  children?: TabItem[];
  onTabChanged?: (index: number) => void;
  tabAlignment?: "left" | "right";
}

interface ITabControlState {
  selectedTabIndex?: number;
}

export class TabControl extends React.Component<ITabControlProps, ITabControlState> {
  constructor() {
    super();
    this.state = { selectedTabIndex: 0 }
  }
  changeTab(newIndex: number) {
    this.setState({ selectedTabIndex: newIndex }, () => {
      if (this.props.onTabChanged) {
        this.props.onTabChanged(newIndex);
      }
    })
  }
  render() {
    const attrs = _.omit(this.props, "className");
    let tabAlignment = this.props.tabAlignment;
    if (!tabAlignment) {
      tabAlignment = "left"
    }
    const classes = classNames(
      this.props.className,
      "tab-control",
      {
        "tabs-right": tabAlignment == "right",
        "tabs-left": tabAlignment == "left"
      }
    );
    return (
      <div {...attrs} className={classes}>
        <div className="tab-control-header">
          {React.Children.map(this.props.children, (c: React.ReactElement<any>, i: number) =>
            <div className={`tab-item-header${this.state.selectedTabIndex === i ? ' selected' : ''}`} onClick={() => this.changeTab(i)}>
              {c.props.icon ? <Icon className="m-right-xsmall" icon={c.props.icon} /> : null}{c.props.title}
            </div>
          )}
        </div>
        {this.props.children[this.state.selectedTabIndex]}
      </div>
    )
  }
}


export interface ITabItemProps extends React.HTMLProps<TabItem> {
  title: any;
  icon?: string;
}

export class TabItem extends React.Component<ITabItemProps, {}> {
  static Icomoon = Icons.Icomoon;

  render() {
    const attrs = _.omit(this.props, "className", "title");
    return <div {...attrs} className={`tab-content${this.props.className ? ` ${this.props.className}` : ''}`}>{this.props.children}</div>
  }
}