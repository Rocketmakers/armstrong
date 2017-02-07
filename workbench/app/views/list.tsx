import * as React from "react";
import { VirtualList } from '../components/virtualList';

interface IListProps extends React.Props<List> {

}

export class List extends React.Component<IListProps, {}> {
  render(){
    return <div style={{ height: '100vh'}}><VirtualList/></div>
  }
}