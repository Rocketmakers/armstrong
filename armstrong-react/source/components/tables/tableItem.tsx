import * as React from "react";
import { ClassHelpers } from "../..";

export interface ITableItem<T> {
  data: T;
  columnKeys: Array<keyof T>;
  columnFormatter?: { [P in keyof T]?: (value: T[P]) => React.ReactNode };
  onClick?: (val: string) => void;
}

export function TableItem<T>({
  data,
  columnFormatter,
  columnKeys,
  onClick,
}: React.PropsWithChildren<ITableItem<T>>) {
  return (
    <tr className={ClassHelpers.classNames("table-row")}>
      {columnKeys.map((col, index) => {
        return (
          <td key={index}>
            {columnFormatter && columnFormatter[col]
              ? columnFormatter[col](data[col])
              : data[col]}
          </td>
        );
      })}
    </tr>
  );
}
