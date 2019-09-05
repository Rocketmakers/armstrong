import * as React from "react";
import * as _ from "underscore";
import { TableHeading, TSortDirection } from "./tableHeader";
import { TableItem } from "./tableItem";
import { TableItemDropdown } from "./tableItemDropdown";
import { TableOptions } from "./tableOptions";
import { IPaginateButtonProps, TablePagination } from "./tablePagingation";
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
  /** (component) Pagination Element  */
  paginationElement?: React.FC<IPaginateButtonProps>;
  /** (boolean) Show the options bar */
  showOptions?: boolean;
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
  paginationElement: PaginationElement,
  showOptions,
  sortBy,
  subTitle,
  title,
}: React.PropsWithChildren<ITableProps<T>>) {
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const columnKeys = React.useMemo(
    () => Object.keys(headerFormatter) as Array<keyof T>,
    [headerFormatter],
  );
  return (
    <div className="table-container">
      <TableTitle title={title} subTitle={subTitle} />
      {showOptions && (
        <div className="table-options-container">
          <TableOptions />
        </div>
      )}

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

      {onChangePage && numberOfPages && PaginationElement && (
        <div className="table-pagination">
          <div style={{ flex: 0.5 }}></div>
          <div className="pagination">
            <TablePagination
              currentPage={currentPage}
              totalPages={numberOfPages}
              render={r => {
                return (
                  <PaginationElement
                    active={currentPage === r.index}
                    index={r.index}
                    onClick={() => {
                      onChangePage(r.index);
                      setCurrentPage(r.index);
                    }}
                    direction={(r.direction && r.direction) || null}
                  />
                );
              }}
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
