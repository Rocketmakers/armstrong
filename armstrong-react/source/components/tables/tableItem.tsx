import * as React from "react";
import { ClassHelpers } from "../..";

export interface ITableItem<T extends {}> {
  data: T;
  columnKeys: Array<keyof T>;
  columnFormatter?: {
    [P in keyof T]?: (value: T[P], row?: T) => any;
  };
}

export function TableItem<T>({ data, columnFormatter, columnKeys }: React.PropsWithChildren<ITableItem<T>>) {
  return (
    <tr className={ClassHelpers.classNames("table-row")}>
      {columnKeys.map((col: keyof T, index: number) => {
        return <td key={index}>{!!columnFormatter && columnFormatter[col] ? columnFormatter[col](data[col], data) : data[col]}</td>;
      })}
    </tr>
  );
}
