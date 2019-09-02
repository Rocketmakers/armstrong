import * as React from "react";
import { storiesOf } from "@storybook/react";
import { Table, useDataTable } from "../_symlink";
import {
  fauxTableData,
  DataTableWithHooksPagination,
  DataTableWithHooksSortableColumns,
} from "./tables";
import "../theme/theme.scss";

async function fetchData() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos");
  return res;
}

storiesOf("Table", module).add("basic", () => <Table data={fauxTableData} />);

storiesOf("Table", module).add("titles", () => (
  <Table data={fauxTableData} title="My Title" subTitle="My Sub Title" />
));

storiesOf("Table", module).add("paginated", () => (
  <DataTableWithHooksPagination />
));

storiesOf("Table", module).add("sortable columns", () => (
  <DataTableWithHooksSortableColumns />
));
