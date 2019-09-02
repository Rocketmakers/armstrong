import * as React from "react";

export interface ITableTitleProps {
  title?: string;
  subTitle?: string;
}

export const TableTitle: React.FunctionComponent<ITableTitleProps> = ({
  subTitle,
  title,
}) => {
  return (
    <div>
      {title && <h3>{title}</h3>}
      {subTitle && <h5>{subTitle}</h5>}
    </div>
  );
};
