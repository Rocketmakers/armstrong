import * as React from "react";
import { storiesOf } from "@storybook/react";
import { Table, useDataTable, Icon } from "../_symlink";
import { IUseDataTableResult } from "../_symlink/hooks/useDataTable";

import "../theme/theme.scss";
import { IPaginateButtonProps } from "../_symlink/components/tables/tablePagingation";

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

function TableHeaderCell(name: string) {
  return <span style={{ color: "gray", fontSize: 20 }}>{name}</span>;
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
        color: active ? "#74b9ff" : "#e17055",
      }}
      onClick={() => onClick(index)}
    >
      {(direction && direction) || index}
    </button>
  );
};

storiesOf("Table", module)
  .add("basic", () => {
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
  .add("options", () => {
    const {
      data,
      downloadTableAsCSV,
      isLoading,
      options,
      printTable,
    } = useDataTable<ITodos>({
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
        // onDownload={() => downloadTableAsCSV(true)}
      />
    );
  })
  .add("titles", () => {
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
  .add("format headers", () => {
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
  .add("format column", () => {
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
    "paginated",
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
  .add("sortable columns", () => {
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
  });
