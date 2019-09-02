import * as React from "react";

export interface ITableItem {
  data: {};
  onClick?: (val: string) => void;
}

export const TableItem: React.FunctionComponent<ITableItem> = ({
  data,
  onClick,
}) => {
  return (
    <tr>
      {Object.keys(data).map(col => {
        return <td>{data[col]}</td>;
      })}
    </tr>
  );
};
