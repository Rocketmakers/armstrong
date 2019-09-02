import * as React from "react";

import { Table, useDataTable } from "../_symlink";

interface IFauxData {
  id: number;
  name: string;
  date: string;
}

export const fauxTableHeaders = ["id", "name", "date"];
export const alphabet = "ABCDEFGHIJKLMNOPQRSTUVXYZ";
export const fauxTableData = alphabet.split("").map((obj, idx) => {
  return {
    id: Math.round(Math.random() * 10),
    name: obj,
    date: new Date().toLocaleString(),
  };
});

/**
 * DataTablePagination
 */
//----------------------------------------------------------
export const DataTableWithHooksPagination = () => {
  const { data, setPage, setItemsPerPage, totalPages } = useDataTable({
    data: fauxTableData,
    itemsPerPage: 5,
  });

  return (
    <Table
      data={data}
      headers={fauxTableHeaders}
      numberOfPages={totalPages}
      onChangeItemPerPage={setItemsPerPage}
      onChangePage={setPage}
      subTitle="My Paginated Data Table"
      title="My Table"
    />
  );
};

/**
 * DataTableSortable
 */
//----------------------------------------------------------
export const DataTableWithHooksSortableColumns = () => {
  const {
    data,
    sortDataBy,
    setPage,
    setItemsPerPage,
    totalPages,
  } = useDataTable({
    data: fauxTableData,
    itemsPerPage: 5,
  });

  return (
    <Table
      data={data}
      headers={fauxTableHeaders}
      sortBy={sortDataBy}
      numberOfPages={totalPages}
      onChangeItemPerPage={setItemsPerPage}
      onChangePage={setPage}
      subTitle="My Sortable Data Table"
      title="My Table"
    />
  );
};
