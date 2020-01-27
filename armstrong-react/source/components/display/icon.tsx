import * as React from "react";
import { ClassHelpers } from "../../utilities/classHelpers";
import { Icons } from "./../../utilities/icons";

export type IconSet = keyof typeof Icons;
export type IconName<Set extends IconSet> = keyof typeof Icons[Set];

export const getIconProps = <Set extends IconSet>(
  iconSet: Set,
  iconName: IconName<Set>
): IIcon => ({
  icon: (Icons[iconSet][iconName] as any) as string,
  iconSet
});

export interface IIcon {
  /** (string) The set of icons to use */
  iconSet?: IconSet;

  /** (string) The icons 'className' eg Icon.Icomoon.Rocket — WARNING: To use an icon set other than icomoon, iconSet must also be set */
  icon: string;
}

export type IconOrJsx = string | IIcon | JSX.Element;

const isIIcon = (icon: IconOrJsx): icon is IIcon => !!(icon as IIcon).icon;

/** get an icon element from a string, an icon object, or just JSX */

export const getIconOrJsx = (
  icon: IconOrJsx,
  iconProps?: Omit<IIconProps, "iconSet" | "icon">,
  wrapJsx?: (icon: JSX.Element) => JSX.Element
): JSX.Element => {
  if (!icon) {
    return null;
  }

  if (typeof icon === "string") {
    return <Icon icon={icon} iconSet="Icomoon" {...iconProps} />;
  }

  if (isIIcon(icon)) {
    return <Icon {...iconProps} {...icon} />;
  }

  if (wrapJsx) {
    return wrapJsx(icon);
  }

  return icon;
};

/** get an icon element from a string, an icon object, or just JSX */

export const useIconOrJsx = (
  icon: IconOrJsx,
  iconProps?: Omit<IIconProps, "iconSet" | "icon">,
  wrapJsx?: (icon: JSX.Element) => JSX.Element
) => {
  return React.useMemo(
    () => (icon ? getIconOrJsx(icon, iconProps, wrapJsx) : null),
    [icon, iconProps, wrapJsx]
  );
};

export interface IIconProps extends React.HTMLAttributes<HTMLElement>, IIcon {
  /** (string) CSS className property */
  className?: string;
}

export const Icon: React.FunctionComponent<IIconProps> &
  Partial<typeof Icons> = props => {
  const { icon, iconSet, className, ...attrs } = props;

  const classes = React.useMemo(
    () => ClassHelpers.classNames("armstrong-icon", "icon", className, icon),
    [className, icon]
  );

  return <i {...attrs} data-icon-set={iconSet} className={classes} />;
};

Icon.defaultProps = {
  iconSet: "Icomoon"
};

// Add icon sets to static Icon to allow old Icon.Icomoon.wrench pattern

Object.keys(Icons).forEach(key => (Icon[key] = Icons[key]));

interface ISpecificIconProps extends Omit<IIconProps, "iconSet" | "icon"> {}

interface IIcomoonIconProps extends ISpecificIconProps {
  iconName: IconName<"Icomoon">;
}

export const IcomoonIcon: React.FunctionComponent<IIcomoonIconProps> = ({
  iconName,
  ...props
}) => <Icon {...props} iconSet="Icomoon" icon={Icon.Icomoon[iconName]} />;

interface ILinearIconsIconProps extends ISpecificIconProps {
  iconName: IconName<"LinearIcons">;
}

export const LinearIcon: React.FunctionComponent<ILinearIconsIconProps> = ({
  iconName,
  ...props
}) => (
  <Icon {...props} iconSet="LinearIcons" icon={Icon.LinearIcons[iconName]} />
);
