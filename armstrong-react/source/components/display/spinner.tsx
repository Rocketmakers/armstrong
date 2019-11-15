import * as React from "react";
import { ClassHelpers } from "../..";
import { getIconOrJsx, Icon, IconOrJsx } from "./icon";

interface ISpinnerProps extends React.HTMLProps<HTMLDivElement> {
  reversed?: boolean;

  /** icon to be rendered if there are no children - defaults to icomoons spinner2 */
  icon?: IconOrJsx;
}

export const Spinner: React.FunctionComponent<ISpinnerProps> = ({
  children,
  className,
  icon,
  reversed,
  ...HTMLProps
}) => (
  <div
    className={ClassHelpers.classNames("spinner", className)}
    {...HTMLProps}
    data-reversed={reversed}
  >
    {children || getIconOrJsx(icon)}
  </div>
);

Spinner.defaultProps = {
  icon: Icon.Icomoon.spinner2
};
