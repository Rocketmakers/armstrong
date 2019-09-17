import * as React from "react";

export type TFilterAction = "add" | "remove" | "clear";
export type TFilterType = "subtractive" | "additive";

export interface IAddFilter {
  type: "add";
  key: any;
  value: React.ReactNode;
}
export interface IRemoveFilter {
  type: "remove";
  key: any;
  value: React.ReactNode;
}
export interface IClearFilters {
  type: "clear";
}

export type FilterActions = IAddFilter | IRemoveFilter | IClearFilters;

export interface IFilter {
  key: any;
  value: React.ReactNode;
}

export type TSortDirection = "asc" | "desc";

export interface IUseDataTableResult<T> {
  data: T[];
}

export interface ISortParameters<T> {
  key: keyof T;
  direction: TSortDirection;
}

export interface IDataTableOptions<T> {
  download?: boolean;
  filter?: {
    filterBy?: Array<keyof T>;
    filtering?: TFilterType;
  };
  hideHeaders?: boolean;
  paginate?: boolean;
  print?: boolean;
  rowsPerPage?: number;
  rowsPerPageArray?: number[];
  sort?: {
    initialSortBy?: ISortParameters<T>;
  };
}

export interface IDataTableOptionsBar<T> extends IDataTableOptions<T> {
  onDownload?: () => void;
  onPrint?: () => void;
  onFilter?: () => void;
}

export interface IUseDataTableState<T> {
  currentPage: number;
  data: T[];
  error: any;
  rowsPerPage: number;
  sortParameters: ISortParameters<T>;
  totalRows: number;
  totalPages: number;
}

export interface IUseDataTableSettings<T> {
  data?: T[];
  fetch?(): Promise<IUseDataTableResult<T>>;
  options: IDataTableOptions<T>;
}

export interface IFilterParameters<T> {
  name: keyof T;
  values: React.ReactNode[];
}
