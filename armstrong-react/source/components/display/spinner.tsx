import * as React from "react";
import { ClassHelpers } from "../../utilities/classHelpers";
import { Icon } from "./icon";

interface ISpinnerProps extends React.HTMLProps<HTMLDivElement> {
    reversed?: boolean
}

export const Spinner: React.FunctionComponent<ISpinnerProps> = ({
  children,
  className,
  reversed,
  ...HTMLProps
}) => (
  <div className={ClassHelpers.classNames("spinner", className)} {...HTMLProps} data-reversed={reversed}>
    {children || <Icon icon={Icon.Icomoon.spinner2} />}
  </div>
);
