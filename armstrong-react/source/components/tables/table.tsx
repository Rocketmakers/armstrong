import * as React from "react";
import * as _ from "underscore";
import { TableHeading, TSortDirection } from "./tableHeader";
import { TableItem } from "./tableItem";
import { TableItemDropdown } from "./tableItemDropdown";
import { TableOptions } from "./tableOptions";
import { IPaginateButtonProps, TablePagination } from "./tablePagingation";
import { TableTitle } from "./tableTitle";

import {
  IDataTableOptions,
  IFilterParameters,
  TFilterAction,
} from "../../hooks/useDataTable";
import { Dialog } from "../display/dialog";

import { Button, ClassHelpers } from "../../";

export interface ITableProps<T> {
  /** (React.ReactNode) Specify the formatting of the individual column */
  columnFormatter?: { [P in keyof T]?: (value: T[P]) => React.ReactNode };
  /** (T[]) The data to display */
  data?: T[];
  filterList?: IFilterParameters[];
  /** (React.ReactNode) Specify the formatting of the header column */
  headerFormatter: {
    [P in keyof T]?: (name: keyof T) => React.ReactNode;
  };
  /** (number) The number of pages of data */
  numberOfPages?: number;
  /** ((rows:number) => void) Event to fire when user changes the max number of items per page */
  onChangeRowsPerPage?: (rows: number) => void;
  /** ((pageNumber:number) => void) Event to fire when user changes the page number */
  onChangePage?: (pageNumber: number) => void;
  /** () => void Event to fire when user downloads the table */
  onDownload?: () => void;
  /** () => void Event to fire when user filters the data by a column */
  onFilter?: (
    action: TFilterAction,
    column?: keyof T,
    value?: React.ReactNode,
  ) => void;
  /** () => void Event to fire when user prints the table */
  onPrint?: (ref: HTMLTableElement) => void;
  /** ((key:keyof T, direction: TSortDirection) => void) Event to fire when user sorts the columns */
  onSortBy?: (key: keyof T, direction: TSortDirection) => void;
  /** (options:IDataTableOptions) Options for the data table */
  options?: IDataTableOptions<T>;
  /** (component) Pagination Element  */
  paginationElement?: React.FC<IPaginateButtonProps>;
  /** (string) The sub or secondary title of the table */
  subTitle?: string;
  /** (string) The title of the table */
  title?: string;
}

export function Table<T = any>({
  data,
  filterList,
  columnFormatter,
  headerFormatter,
  numberOfPages,
  onChangeRowsPerPage,
  onChangePage,
  onDownload,
  onFilter,
  onPrint,
  onSortBy,
  options,
  paginationElement: PaginationElement,
  subTitle,
  title,
}: React.PropsWithChildren<ITableProps<T>>) {
  const ref = React.useRef<HTMLTableElement>(null);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [filterDialogState, setFilterDialogState] = React.useState<boolean>(
    false,
  );

  const columnKeys = React.useMemo(
    () => Object.keys(headerFormatter) as Array<keyof T>,
    [headerFormatter],
  );
  return (
    <div className={ClassHelpers.classNames("table-container")}>
      <TableTitle title={title} subTitle={subTitle} />
      {options && (
        <div className={ClassHelpers.classNames("table-options-container")}>
          <TableOptions
            {...options}
            onDownload={onDownload}
            onPrint={() => onPrint(ref.current)}
            onFilter={() => {
              setFilterDialogState(true);
            }}
          />
        </div>
      )}
      <table id={title} ref={ref} className={ClassHelpers.classNames("table")}>
        {options && options.hideHeaders ? null : (
          <thead className={ClassHelpers.classNames("table-header")}>
            <tr>
              {headerFormatter &&
                columnKeys.map((header, i) => (
                  <TableHeading<T>
                    key={i}
                    name={header}
                    cell={headerFormatter[header]}
                    sortBy={(onSortBy && onSortBy) || null}
                    initSort={
                      options &&
                      options.sort &&
                      options.sort.initialSortBy &&
                      options.sort.initialSortBy.key === header
                        ? options.sort.initialSortBy.direction
                        : null
                    }
                  />
                ))}
            </tr>
          </thead>
        )}
        <tbody className={ClassHelpers.classNames("table-body")}>
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
        <div className={ClassHelpers.classNames("table-pagination")}>
          <div style={{ flex: 0.5 }}></div>
          <div className={ClassHelpers.classNames("pagination")}>
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
            onSelect={onChangeRowsPerPage}
          />
        </div>
      )}
      <Dialog
        bodySelector="body"
        isOpen={filterDialogState}
        onClose={() => setFilterDialogState(false)}
      >
        {filterList && (
          <TableFilters
            onAddFilter={() => null}
            filterValues={filterList}
            onClear={() => console.log("clear")}
          />
        )}
      </Dialog>
    </div>
  );
}

const TableFilters: React.FunctionComponent<{
  filterValues: IFilterParameters[];
  onClear: () => void;
  onAddFilter: (name: string, value: React.ReactNode) => void;
}> = ({ filterValues, onClear }) => {
  return (
    <>
      <div className={ClassHelpers.classNames("table-filters")}>
        <div className={ClassHelpers.classNames("title")}>Filters</div>
        <Button
          className={ClassHelpers.classNames("table-reset-filter-btn")}
          onClick={onClear}
        >
          Clear
        </Button>
      </div>
      {filterValues.map(f => {
        return (
          <>
            <div>
              {f.name}
              <select onChange={e => null}>
                {f.values.map((ff, idx) => {
                  switch (typeof ff) {
                    case "boolean": {
                      const v = ff ? "true" : "false";
                      return <option key={idx} label={v} value={v} />;
                    }
                    default: {
                      const v = ff as string;
                      return <option key={idx} label={v} value={v} />;
                    }
                  }
                })}
                }
              </select>
            </div>
          </>
        );
      })}
    </>
  );
};
