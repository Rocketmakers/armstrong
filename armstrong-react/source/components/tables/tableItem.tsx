import * as React from "react";
import { ClassHelpers } from "../..";

export interface ITableItem<T> {
  data: T;
  columnKeys: Array<keyof T>;
  columnFormatter?: {
    [P in keyof T]?: (value: T[P], row?: T) => React.ReactNode;
  };
  onClick?: (data: T) => void;
}

export function TableItem<T>({
  data,
  columnFormatter,
  columnKeys,
  onClick,
}: React.PropsWithChildren<ITableItem<T>>) {
  return (
    <tr
      // onClick={() => onClick(data)}
      className={ClassHelpers.classNames("table-row")}
    >
      {columnKeys.map((col: keyof T, index: number) => {
        return (
          <td key={index}>
            {columnFormatter && columnFormatter[col]
              ? columnFormatter[col](data[col], data)
              : data[col]}
          </td>
        );
      })}
    </tr>
  );
}
