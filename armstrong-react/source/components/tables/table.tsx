import * as React from "react";
import * as _ from "underscore";
import { Repeater } from "../layout/repeater";
import { TableHeading, TSortDirection } from "./tableHeader";
import { TableItem } from "./tableItem";
import { TableItemDropdown } from "./tableItemDropdown";
import { TableTitle } from "./tableTitle";

import "./styles.scss";

export interface ITableProps<T> {
  /** (React.ReactNode) Specify the formatting of the individual column */
  columnFormatter?: { [P in keyof T]?: (value: T[P]) => React.ReactNode };
  /** (T[]) The data to display */
  data?: T[];
  /** (React.ReactNode) Specify the formatting of the header column */
  headerFormatter: {
    [P in keyof T]?: (name: keyof T) => React.ReactNode;
  };
  /** ((items:number) => void) Event to fire when user changes the max number of items per page*/
  onChangeItemPerPage?: (items: number) => void;
  /** (boolean) Setting this will either display or hide the headers */
  hideHeaders?: boolean;
  /** (number) The number of pages of data */
  numberOfPages?: number;
  /** ((pageNumber:number) => void) Event to fire when user changes the page number */
  onChangePage?: (pageNumber: number) => void;
  /** ((key:keyof T, direction: TSortDirection) => void) Event to fire when user sorts the columns */
  sortBy?: (key: keyof T, direction: TSortDirection) => void;
  /** (string) The sub or secondary title of the table */
  subTitle?: string;
  /** (string) The title of the table */
  title?: string;
}

export function Table<T = any>({
  data,
  columnFormatter,
  headerFormatter,
  onChangeItemPerPage,
  hideHeaders,
  numberOfPages,
  onChangePage,
  sortBy,
  subTitle,
  title,
}: React.PropsWithChildren<ITableProps<T>>) {
  const columnKeys = React.useMemo(
    () => Object.keys(headerFormatter) as Array<keyof T>,
    [headerFormatter],
  );
  return (
    <div className="table-container">
      <TableTitle title={title} subTitle={subTitle} />
      <table className="table">
        {!hideHeaders ? (
          <thead className="table-header">
            <tr>
              {headerFormatter &&
                columnKeys.map((header, i) => (
                  <TableHeading<T>
                    key={i}
                    name={header}
                    cell={headerFormatter[header]}
                    sortBy={sortBy}
                  />
                ))}
            </tr>
          </thead>
        ) : null}
        <tbody className="table-body">
          {data.map((rows, idx: number) => {
            return (
              <TableItem
                key={idx}
                data={rows}
                columnKeys={columnKeys}
                columnFormatter={columnFormatter}
              />
            );
          })}
        </tbody>
      </table>

      {onChangePage && numberOfPages && (
        <div className="table-pagination">
          <div style={{ flex: 0.5 }}></div>
          <div className="pagination">
            <Repeater
              count={numberOfPages}
              render={r => (
                <button onClick={() => onChangePage(r.index)}>{r.index}</button>
              )}
            />
          </div>

          <TableItemDropdown
            values={[5, 10, 20, 0]}
            onSelect={onChangeItemPerPage}
          />
        </div>
      )}
    </div>
  );
}
