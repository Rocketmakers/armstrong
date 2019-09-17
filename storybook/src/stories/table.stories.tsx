import * as React from "react";

import { storiesOf } from "@storybook/react";
import { Table, useDataTable, Icon } from "../_symlink";
import { IPaginateButtonProps } from "../_symlink/components/tables/tablePagingation";
import { IUseDataTableResult } from "../_symlink/components/tables/tableTypes";

import "../theme/theme.scss";

const fauxDataUrl = "https://jsonplaceholder.typicode.com/todos";
interface ITodos {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

async function fetchData() {
  const res = await fetch(fauxDataUrl);
  return res.json();
}

async function loadData(): Promise<IUseDataTableResult<ITodos>> {
  const res = await fetch(fauxDataUrl, { method: "GET" });
  const data = ((await res.json()) as unknown) as ITodos[];

  return {
    data,
  };
}

function capitalizeFirstLetter(str: string): string {
  const s = str.toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function TableHeaderCell(name: string) {
  return (
    <span style={{ color: "gray", fontSize: 20 }}>
      {capitalizeFirstLetter(name)}
    </span>
  );
}

function CompletedTableCell(value: boolean) {
  return value ? (
    <Icon icon={Icon.Icomoon.thumbsUp} />
  ) : (
    <Icon icon={Icon.Icomoon.thumbsDown} />
  );
}
function CompletedTableCellButton(value: boolean) {
  return <button>{value ? "true" : "false"}</button>;
}

const ExamplePaginationButton: React.FC<IPaginateButtonProps> = ({
  active,
  direction,
  index,
  onClick,
}) => {
  return (
    <button
      style={{
        backgroundColor: "unset",
        border: "unset",
        color: active ? "#3498d8" : "#4f5c69",
        fontWeight: active ? 500 : 200,
      }}
      onClick={() => onClick(index)}
    >
      {(direction && direction) || index}
    </button>
  );
};

storiesOf("Table", module)
  .add("Simple table", () => {
    const [state, setState] = React.useState([]);

    React.useEffect(() => {
      const getData = async () => {
        const res = await fetchData();
        setState(res);
      };
      getData();
    }, []);

    return (
      <Table<ITodos>
        headerFormatter={{
          id: null,
          completed: null,
          title: null,
          userId: null,
        }}
        columnFormatter={{
          completed: CompletedTableCell,
        }}
        data={state}
      />
    );
  })
  .add("Table with titles", () => {
    const [state, setState] = React.useState([]);

    React.useEffect(() => {
      const getData = async () => {
        const res = await fetchData();
        setState(res);
      };
      getData();
    }, []);
    return (
      <Table<ITodos>
        headerFormatter={{
          id: null,
          completed: null,
          title: null,
          userId: null,
        }}
        columnFormatter={{
          completed: CompletedTableCell,
        }}
        data={state}
        title="My Table"
        subTitle="My Table with Titles"
      />
    );
  })
  .add("Table with options", () => {
    const { data, downloadTableAsCSV, options, printTable } = useDataTable<
      ITodos
    >({
      fetch: loadData,
      options: {
        rowsPerPage: 10,
        download: true,
        print: true,
      },
    });

    return (
      <Table<ITodos>
        headerFormatter={{
          id: null,
          completed: null,
          title: null,
          userId: null,
        }}
        columnFormatter={{
          completed: CompletedTableCell,
        }}
        data={data}
        options={options}
        onDownload={downloadTableAsCSV}
        onPrint={printTable}
      />
    );
  })

  .add("Table with formatted headers", () => {
    const [state, setState] = React.useState([]);

    React.useEffect(() => {
      const getData = async () => {
        const res = await fetchData();
        setState(res);
      };
      getData();
    }, []);

    return (
      <Table<ITodos>
        headerFormatter={{
          id: TableHeaderCell,
          completed: TableHeaderCell,
          title: TableHeaderCell,
          userId: TableHeaderCell,
        }}
        columnFormatter={{
          completed: CompletedTableCell,
        }}
        data={state}
        title="My Table"
        subTitle="My Table with Formatted Headers"
      />
    );
  })
  .add("Table with formatted columns", () => {
    const [state, setState] = React.useState([]);

    React.useEffect(() => {
      const getData = async () => {
        const res = await fetchData();
        setState(res);
      };
      getData();
    }, []);

    return (
      <Table<ITodos>
        headerFormatter={{
          id: TableHeaderCell,
          completed: TableHeaderCell,
          title: TableHeaderCell,
          userId: TableHeaderCell,
        }}
        columnFormatter={{
          completed: CompletedTableCellButton,
        }}
        data={state}
        title="My Table"
        subTitle="My Table with Formatted Headers"
      />
    );
  })
  .add(
    "Table with pagination (Hooks)",
    () => {
      const {
        data,
        isLoading,
        options,
        setPage,
        setRowsPerPage,
        totalPages,
      } = useDataTable<ITodos>({
        fetch: loadData,
        options: {
          rowsPerPage: 5,
          paginate: true,
        },
      });
      return isLoading ? (
        <div>Loading</div>
      ) : (
        <Table<ITodos>
          headerFormatter={{
            id: TableHeaderCell,
            completed: TableHeaderCell,
            title: TableHeaderCell,
            userId: TableHeaderCell,
          }}
          columnFormatter={{
            completed: CompletedTableCell,
          }}
          data={data}
          numberOfPages={totalPages}
          options={options}
          onChangeRowsPerPage={setRowsPerPage}
          onChangePage={setPage}
          paginationElement={ExamplePaginationButton}
          subTitle="My Paginated Data Table"
          title="My Table"
        />
      );
    },
    {},
  )
  .add("Table with sortable columns (Hooks)", () => {
    const { data, isLoading, options, sortDataBy } = useDataTable<ITodos>({
      fetch: loadData,
      options: {
        rowsPerPage: 5,
        sort: {
          initialSortBy: { key: "title", direction: "asc" },
        },
      },
    });

    return isLoading ? (
      <div>Loading</div>
    ) : (
      <Table<ITodos>
        columnFormatter={{
          completed: b => <p>{b ? "true" : "false"}</p>,
        }}
        data={data}
        headerFormatter={{
          id: TableHeaderCell,
          completed: TableHeaderCell,
          title: TableHeaderCell,
          userId: TableHeaderCell,
        }}
        options={options}
        onSortBy={sortDataBy}
        paginationElement={ExamplePaginationButton}
        subTitle="My Sortable Data Table"
        title="My Table"
      />
    );
  })
  .add("Filterable Table (Subtractive) (Hooks)", () => {
    const {
      data,
      filters,
      filterList,
      isLoading,
      options,
      setPage,
      setRowsPerPage,
      totalPages,
      updateFilter,
    } = useDataTable<ITodos>({
      fetch: loadData,
      options: {
        rowsPerPage: 100,
        filter: { filterBy: ["userId", "completed"], filtering: "subtractive" },
        paginate: true,
      },
    });

    return isLoading ? (
      <div>Loading</div>
    ) : (
      <>
        <Table<ITodos>
          columnFormatter={{
            completed: b => <p>{b ? "true" : "false"}</p>,
          }}
          data={data}
          filters={filters}
          filterList={filterList}
          headerFormatter={{
            id: TableHeaderCell,
            completed: TableHeaderCell,
            title: TableHeaderCell,
            userId: TableHeaderCell,
          }}
          numberOfPages={totalPages}
          onChangePage={setPage}
          onChangeRowsPerPage={setRowsPerPage}
          onUpdateFilter={updateFilter}
          options={options}
          paginationElement={ExamplePaginationButton}
          subTitle="My Filterable Data Table"
          title="My Table"
        />
      </>
    );
  })
  .add("Filterable Table (Additive) (Hooks)", () => {
    const {
      data,
      filters,
      filterList,
      isLoading,
      options,
      setPage,
      setRowsPerPage,
      totalPages,
      updateFilter,
    } = useDataTable<ITodos>({
      fetch: loadData,
      options: {
        rowsPerPage: 100,
        filter: { filterBy: ["userId"], filtering: "additive" },
        paginate: true,
      },
    });

    return isLoading ? (
      <div>Loading</div>
    ) : (
      <>
        <Table<ITodos>
          columnFormatter={{
            completed: b => <p>{b ? "true" : "false"}</p>,
          }}
          data={data}
          filters={filters}
          filterList={filterList}
          headerFormatter={{
            id: TableHeaderCell,
            completed: TableHeaderCell,
            title: TableHeaderCell,
            userId: TableHeaderCell,
          }}
          numberOfPages={totalPages}
          onChangePage={setPage}
          onChangeRowsPerPage={setRowsPerPage}
          onUpdateFilter={updateFilter}
          options={options}
          paginationElement={ExamplePaginationButton}
          subTitle="My Filterable Data Table"
          title="My Table"
        />
      </>
    );
  });
