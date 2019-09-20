import * as React from "react";
import { ClassHelpers } from "../..";

export interface ITableTitleProps {
  title?: string;
  subTitle?: string;
}

export const TableTitle: React.FunctionComponent<ITableTitleProps> = ({
  subTitle,
  title,
}) => {
  return (
    <div className={ClassHelpers.classNames("table-titles")}>
      {title && <div className={ClassHelpers.classNames("title")}>{title}</div>}
      {subTitle && (
        <div className={ClassHelpers.classNames("sub-title")}>{subTitle}</div>
      )}
    </div>
  );
};
