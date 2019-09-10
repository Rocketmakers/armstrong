import * as React from "react"
import * as _ from "underscore";
import { storiesOf } from '@storybook/react';
import { DataList } from "../_symlink";

import "../theme/theme.scss";

let items = _.range(0, 20).map(item => `Data item (${item})`);

const getSomeData = (callback: (fetching: boolean) => any) => {
  callback(true);
  window.setTimeout(() => {
    items.unshift(..._.range(0, 5).map(item => `New data item (${items.length + item})`))
    callback(false);
  }, 2000)
}

const dataItemStyle: React.CSSProperties = {
  padding: "15px",
  margin: "5px 10px 15px 10px",
  boxShadow: "0 0 5px rgba(0,0,0,0.1)"
}

const customRefreshStyle: React.CSSProperties = {
  height: "100%",
  width: "100%",
  background: "#EB5757",
  color: "white",
  display: "flex",
  fontWeight: "bold",
  alignItems: "center",
  justifyContent: "center"
}

storiesOf('Mobile Data List', module)
  .add('Standard', () => {
    const [fetchingData, setFetchingData] = React.useState(false);
    return (
      <div style={{ height: "400px" }}>
        <DataList refreshData={() => getSomeData(setFetchingData)} refreshing={fetchingData} postRefreshDelayMs={0}>
          {items.map(item => <div style={dataItemStyle}>{item}</div>)}
        </DataList>
      </div>
    )
  })
  .add('Hide children', () => {
    const [fetchingData, setFetchingData] = React.useState(false);
    return (
      <div style={{ height: "400px" }}>
        <DataList refreshData={() => getSomeData(setFetchingData)} refreshing={fetchingData} hideChildrenWhileRefreshing={true}>
          {items.map(item => <div style={dataItemStyle}>{item}</div>)}
        </DataList>
      </div>
    )
  })
  .add('Custom refresh UI', () => {
    const [fetchingData, setFetchingData] = React.useState(false);

    return (
      <div style={{ height: "400px" }}>
        <DataList
          refreshData={() => getSomeData(setFetchingData)}
          refreshing={fetchingData}
          refreshingComponent={<div style={customRefreshStyle}>IT IS ME. THE CUSTOM REFRESH UI</div>}>
          {items.map(item => <div style={dataItemStyle}>{item}</div>)}
        </DataList>
      </div>
    )
  })