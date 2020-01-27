import * as React from "react";
import * as _ from "underscore";
import { storiesOf } from "@storybook/react";
import { DataList } from "../_symlink";

import "../theme/theme.scss";

let items = _.range(0, 20).map(item => `Data item (${item})`);

const getSomeData = (callback: (fetching: boolean) => any) => {
  callback(true);
  window.setTimeout(() => {
    items.unshift(
      ..._.range(0, 5).map(item => `New data item (${items.length + item})`)
    );
    callback(false);
  }, 2000);
};

const dataItemStyle: React.CSSProperties = {
  padding: "15px",
  margin: "5px 10px 15px 10px",
  boxShadow: "0 0 5px rgba(0,0,0,0.1)"
};

const customRefreshStyle: React.CSSProperties = {
  height: "100%",
  width: "100%",
  background: "#EB5757",
  color: "white",
  display: "flex",
  fontWeight: "bold",
  alignItems: "center",
  justifyContent: "center"
};

storiesOf("Mobile Data List", module)
  .addParameters({
    options: {
      showAddonPanel: true
    }
  })
  .add("Standard", () => {
    const [fetchingData, setFetchingData] = React.useState(false);

    React.useEffect(() => {
      getSomeData(setFetchingData);
    }, []);

    return (
      <>
        <p>
          DataList is a pull to refresh component for mobile devices that uses
          touch events.
        </p>
        <br />
        <pre>
          {`<DataList`}
          <br />
          {`  skipFirstFetch={true}`}
          <br />
          {`  refreshData={() => getSomeData(setFetchingData)}`}
          <br />
          {`  refreshing={fetchingData}`}
          <br />
          {`  postRefreshDelayMs={1000}`}
          <br />
          {`>`}
        </pre>

        <br />
        <br />

        <div style={{ height: "400px" }}>
          <DataList
            style={{ border: "solid gray 2px" }}
            skipFirstFetch={true}
            refreshData={() => getSomeData(setFetchingData)}
            refreshing={fetchingData}
            postRefreshDelayMs={1000}
          >
            {items.map((item, index) => (
              <div key={`data-list-item-${index}`} style={dataItemStyle}>
                {item}
              </div>
            ))}
          </DataList>
        </div>
      </>
    );
  })
  .add("Hide children", () => {
    const [fetchingData, setFetchingData] = React.useState(false);
    return (
      <>
        <p>Children can optionally be hidden while refreshing</p>
        <br />
        <pre>
          {`<DataList`}
          <br />
          {`  skipFirstFetch={true}`}
          <br />
          {`  refreshData={() => getSomeData(setFetchingData)}`}
          <br />
          {`  refreshing={fetchingData}`}
          <br />
          {`  hideChildrenWhileRefreshing={true}`}
          <br />
          {`>`}
        </pre>

        <br />
        <br />

        <div style={{ height: "400px" }}>
          <DataList
            style={{ border: "solid gray 2px" }}
            refreshData={() => getSomeData(setFetchingData)}
            refreshing={fetchingData}
            hideChildrenWhileRefreshing={true}
          >
            {items.map((item, index) => (
              <div key={`data-list-item-${index}`} style={dataItemStyle}>
                {item}
              </div>
            ))}
          </DataList>
        </div>
      </>
    );
  })
  .add("Custom refresh UI", () => {
    const [fetchingData, setFetchingData] = React.useState(false);

    return (
      <>
        <p>Custom JSX can be passed in as the refresh UI</p>
        <br />
        <pre>
          {`<DataList`}
          <br />
          {`  skipFirstFetch={true}`}
          <br />
          {`  refreshData={() => getSomeData(setFetchingData)}`}
          <br />
          {`  refreshing={fetchingData}`}
          <br />
          {`  refreshingComponent={`}
          <br />
          {`    <div style={customRefreshStyle}>`}
          <br />
          {`      IT IS ME. THE CUSTOM REFRESH UI`}
          <br />
          {`    </div>`}
          <br />
          {`  }`}
          <br />
          {`>`}
        </pre>

        <br />
        <br />

        <div style={{ height: "400px" }}>
          <DataList
            style={{ border: "solid gray 2px" }}
            refreshData={() => getSomeData(setFetchingData)}
            refreshing={fetchingData}
            refreshingComponent={
              <div style={customRefreshStyle}>
                IT IS ME. THE CUSTOM REFRESH UI
              </div>
            }
          >
            {items.map((item, index) => (
              <div key={`data-list-item-${index}`} style={dataItemStyle}>
                {item}
              </div>
            ))}
          </DataList>
        </div>
      </>
    );
  });
