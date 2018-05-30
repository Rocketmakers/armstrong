import * as React from "react";
import { Icon } from "./../display/icon";
import { ClassHelpers } from "../../utilities/classNames";

export interface ITabControlProps extends React.HTMLAttributes<HTMLDivElement> {
  /** (number) The index of the tab selected when the control renders. Defaults to 0 */
  defaultSelectedIndex?: number;
  /** (number) The index of the tab selected. Use this if you want a stateless component */
  forceSelectedIndex?: number;
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
    const { onTabChanged, forceSelectedIndex } = this.props
    const tabChanged = () => {
      if (onTabChanged) {
        onTabChanged(newIndex);
      }
    }
    if (forceSelectedIndex === undefined) {
      this.setState({ selectedTabIndex: newIndex }, tabChanged);
    } else {
      tabChanged();
    }
  }

  componentWillMount() {
    const { defaultSelectedIndex, forceSelectedIndex } = this.props
    if (defaultSelectedIndex !== undefined && forceSelectedIndex === undefined) {
      this.setState({ selectedTabIndex: defaultSelectedIndex })
    }
  }

  private getSelectedIndex() {
    const { forceSelectedIndex } = this.props;
    const { selectedTabIndex } = this.state;
    if (forceSelectedIndex !== undefined) {
      return forceSelectedIndex
    }
    return selectedTabIndex
  }

  render() {
    let { className, children, onTabChanged, tabAlignment, defaultSelectedIndex, forceSelectedIndex, ...attrs } = this.props
    if (!tabAlignment) {
      tabAlignment = "left"
    }
    const classes = ClassHelpers.classNames(
      className,
      "tab-control",
      {
        "tabs-right": tabAlignment == "right",
        "tabs-left": tabAlignment == "left"
      }
    );
    const filteredChildren = React.Children.toArray(children).filter(c => !!c)
    const selectedIndex = this.getSelectedIndex();
    return (
      <div {...attrs} className={classes}>
        <div className="tab-control-header">
          {filteredChildren.map((c: React.ReactElement<any>, i: number) =>
            <div className={`tab-item-header${selectedIndex === i ? ' selected' : ''}`} onClick={() => this.changeTab(i)}>
              {c.props.icon ? <Icon className="m-right-xsmall" icon={c.props.icon} /> : null}{c.props.title}
            </div>
          )}
        </div>
        {filteredChildren[selectedIndex]}
      </div>
    )
  }
}


export interface ITabItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** (string | JSX.Element) The content to use in the tab items header */
  title: any;
  /** (string (Icomoon)) An optional icon to show to the left of the title in the tab header */
  icon?: string;
}

export class TabItem extends React.Component<ITabItemProps, {}> {
  render() {
    const { className, title, children, ...attrs } = this.props
    return <div {...attrs} className={`tab-content${className ? ` ${className}` : ''}`}>{children}</div>
  }
}