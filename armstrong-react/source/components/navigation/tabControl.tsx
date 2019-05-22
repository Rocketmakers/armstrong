import * as React from "react";
import { ClassHelpers } from "../../utilities/classHelpers";
import { Icon } from "./../display/icon";
import { Utils } from '../../utilities/utils';

export interface ITabControlProps extends React.HTMLAttributes<HTMLDivElement> {
  /** (number) The index of the tab selected when the control renders. Defaults to 0 */
  defaultSelectedIndex?: number;
  /** (number) The index of the tab selected. Use this if you want a stateless component */
  forceSelectedIndex?: number;
  /** (TabItem[]) The tab items. Controls the header and the content */
  children?: React.ReactElement<ITabItemProps> | Array<React.ReactElement<ITabItemProps>>;
  /** ((index: number) => void) Fires when the tab is changed by the user */
  onTabChanged?: (index: number) => void;
  /** ('left' | 'right') Wether to align the tabs to the right or left of the header. Defaults to left */
  tabAlignment?: "left" | "right";
}

export const TabControl = (props: ITabControlProps) => {
  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0)
  const { className, children, onTabChanged, defaultSelectedIndex, forceSelectedIndex, ...attrs } = props

  const changeTab = React.useCallback((newIndex: number) => () => {
    const tabChanged = () => {
      if (onTabChanged) {
        onTabChanged(newIndex);
      }
    }
    if (forceSelectedIndex === undefined) {
      setSelectedTabIndex(newIndex);
      tabChanged()
    } else {
      tabChanged();
    }
  }, [onTabChanged, forceSelectedIndex, setSelectedTabIndex])

  React.useEffect(() => {
    if (defaultSelectedIndex !== undefined && forceSelectedIndex === undefined) {
      setSelectedTabIndex(defaultSelectedIndex)
    }
  }, [])

  const getSelectedIndex = React.useCallback(() => {
    if (forceSelectedIndex !== undefined) {
      return forceSelectedIndex
    }
    return selectedTabIndex
  }, [forceSelectedIndex, selectedTabIndex])

  let { tabAlignment } = props
  if (!tabAlignment) {
    tabAlignment = "left"
  }

  const classes = React.useMemo(() => ClassHelpers.classNames(
    className,
    "tab-control",
    {
      "tabs-right": tabAlignment === "right",
      "tabs-left": tabAlignment === "left",
    },
  ), [className, tabAlignment])

  const filteredChildren = Utils.filter(React.Children.toArray(children), c => !!c)
  const selectedIndex = getSelectedIndex();
  return (
    <div {...attrs} className={classes}>
      <div className="tab-control-header">
        {filteredChildren.map((c: React.ReactElement<ITabItemProps>, i: number) =>
          <div key={i} className={`tab-item-header${selectedIndex === i ? " selected" : ""}`} onClick={changeTab(i)}>
            {c.props.icon ? <Icon className="m-right-xsmall" icon={c.props.icon} /> : null}{c.props.title}
          </div>,
        )}
      </div>
      {filteredChildren[selectedIndex]}
    </div>
  )

}

export interface ITabItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** (string | JSX.Element) The content to use in the tab items header */
  title: any;
  /** (string (Icomoon)) An optional icon to show to the left of the title in the tab header */
  icon?: string;
}

export const TabItem: React.FC<ITabItemProps> = props => {
  const { className, title, children, ...attrs } = props
  return <div {...attrs} className={`tab-content${className ? ` ${className}` : ""}`}>{children}</div>
}
