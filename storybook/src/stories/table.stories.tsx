import * as React from "react";
import { storiesOf } from "@storybook/react";
import { Table, useDataTable } from "../_symlink";

import "../theme/theme.scss";

interface IFauxData {
  id: number;
  name: string;
  date: string;
}

const fauxTableHeaders = ["id", "name", "date"];
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVXYZ";
const fauxTableData = alphabet.split("").map((obj, idx) => {
  return {
    id: Math.round(Math.random() * 10),
    name: obj,
    date: new Date().toLocaleString(),
  };
});

storiesOf("Table", module).add("basic", () => <Table data={fauxTableData} />);

storiesOf("Table", module).add("titles", () => (
  <Table data={fauxTableData} title="My Title" subTitle="My Sub Title" />
));

storiesOf("Table", module).add("headers", () => (
  <Table data={fauxTableData} subTitle="My Sub Title" title="My Title" />
));

const DataTableWithHooksPagination = () => {
  const { data, setPage, setItemsPerPage } = useDataTable<IFauxData>({
    data: fauxTableData,
    itemsPerPage: 5,
  });

  return (
    <Table
      data={data}
      headers={fauxTableHeaders}
      onChangeItemPerPage={setItemsPerPage}
      onChangePage={setPage}
      subTitle="My Paginated Data Table"
      title="My Table"
    />
  );
};

storiesOf("Table", module).add("paginated", () => (
  <DataTableWithHooksPagination />
));

const DataTableWithHooksSortableColumns = () => {
  const {
    data,
    sortDataBy,
    setPage,
    setItemsPerPage,
    totalPages,
  } = useDataTable<IFauxData>({
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

storiesOf("Table", module).add("sortable columns", () => (
  <DataTableWithHooksSortableColumns />
));
