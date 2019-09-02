import * as React from "react";

import "./styles.scss";

export interface ITableItem {
  data: {};
  onClick?: (val: string) => void;
}

export const TableItem: React.FunctionComponent<ITableItem> = ({
  data,
  onClick,
}) => {
  return (
    <tr className="table-row">
      {Object.keys(data).map(col => {
        return <td key={data[col]}>{data[col]}</td>;
      })}
    </tr>
  );
};
