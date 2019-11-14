import * as React from "react";
import { ClassHelpers } from "../../utilities/classHelpers";
import { Icons } from "./../../utilities/icons";

export type IconSet = keyof typeof Icons;
export type IconName<Set extends IconSet> = keyof typeof Icons[Set];

export interface IIconDefinition<Set extends IconSet> {
  /** (string) The icons 'className' eg Icon.Icomoon.Rocket, DEPRECATED IN FAVOUR OF USING ICONSET AND ICONNAME PROPS */
  icon?: string;

  /** (string) The set of icons to use */
  iconSet?: Set;

  /** (string) the name of the icon in that set to use */
  iconName?: IconName<Set>;
}

export const getIcon = <T extends IconSet>({
  icon,
  iconSet,
  iconName
}: IIconDefinition<T>) => icon || Icons[iconSet][iconName];

export interface IIconProps<Set extends IconSet = "Icomoon">
  extends IIconDefinition<Set>,
    React.HTMLAttributes<HTMLElement> {
  /** (string) CSS className property */
  className?: string;
}

type IconComponent = (<Set extends IconSet>(
  props: React.PropsWithChildren<IIconProps<Set>>
) => React.ReactElement) &
  Partial<
    typeof Icons & {
      defaultProps: Partial<IIconProps<IconSet>>;
    }
  >;

export const Icon: IconComponent = props => {
  const { icon, iconSet, iconName, className, ...attrs } = props;

  const iconClass = React.useMemo(() => {
    if (icon) {
      return icon;
    }

    if (iconName || iconSet) {
      if (iconName && iconSet) {
        return getIcon({ iconName, iconSet });
      }
      // tslint:disable-next-line: no-console
      console.error(
        "WARNING: IconSet and IconName props must both be passed into an Armstrong Icon component"
      );
    }
    // tslint:disable-next-line: no-console
    console.error(
      "WARNING: Either IconSet and IconName props OR the Icon prop must be passed into an Armstrong Icon component"
    );
  }, [icon, iconName, iconSet]);

  const classes = React.useMemo(
    () =>
      ClassHelpers.classNames("armstrong-icon", "icon", className, iconClass),
    [className, iconClass]
  );

  return <i {...attrs} data-icon-set={iconSet} className={classes} />;
};

Icon.defaultProps = {
  iconSet: "Icomoon"
};

// Add icon sets to static Icon to allow old Icon.Icomoon.wrench pattern

Object.keys(Icons).forEach(key => (Icon[key] = Icons[key]));
