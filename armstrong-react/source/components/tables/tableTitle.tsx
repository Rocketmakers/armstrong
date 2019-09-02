import * as React from "react";

import "./styles.scss";
export interface ITableTitleProps {
  title?: string;
  subTitle?: string;
}

export const TableTitle: React.FunctionComponent<ITableTitleProps> = ({
  subTitle,
  title,
}) => {
  return (
    <div className="table-titles">
      {title && <div className="title">{title}</div>}
      {subTitle && <div className="sub-title">{subTitle}</div>}
    </div>
  );
};
