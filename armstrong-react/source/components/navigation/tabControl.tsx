import * as React from "react";
import * as _ from "underscore";
import { Icon } from "./../display/icon";
import { ClassHelpers } from "../../utilities/classNames";

export interface ITabControlProps extends React.HTMLProps<TabControl> {
  /** (number) The index of the tab selected when the control renders. Defaults to 0 */
  defaultSelectedIndex?: number;
  /** (TabItem[]) The tab items. Controls the header and the content */
  children?: React.ReactNode | TabItem | TabItem[];
  /** ((index: number) => void) Fires when the tab is changed by the user */
  onTabChanged?: (index: number) => void;
  /** ('left' | 'right') Wether to align the tabs to the right or left of the header. Defaults to left */
  tabAlignment?: "left" | "right";
}

export interface ITabControlState {
  selectedTabIndex?: number;
}

export class TabControl extends React.Component<ITabControlProps, ITabControlState> {
  constructor(props: ITabControlProps) {
    super(props);
    this.state = { selectedTabIndex: 0 }
  }
  changeTab(newIndex: number) {
    this.setState({ selectedTabIndex: newIndex }, () => {
      if (this.props.onTabChanged) {
        this.props.onTabChanged(newIndex);
      }
    })
  }
  componentWillMount(){
    if (this.props.defaultSelectedIndex !== undefined){
      this.setState({ selectedTabIndex: this.props.defaultSelectedIndex })
    }
  }
  render() {
    const attrs = _.omit(this.props, "className");
    let tabAlignment = this.props.tabAlignment;
    if (!tabAlignment) {
      tabAlignment = "left"
    }
    const classes = ClassHelpers.classNames(
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
  /** (string | JSX.Element) The content to use in the tab items header */
  title: any;
  /** (string (Icomoon)) An optional icon to show to the left of the title in the tab header */
  icon?: string;
}

export class TabItem extends React.Component<ITabItemProps, {}> {
  render() {
    const attrs = _.omit(this.props, "className", "title");
    return <div {...attrs} className={`tab-content${this.props.className ? ` ${this.props.className}` : ''}`}>{this.props.children}</div>
  }
}