import * as React from "react";

import "./virtualList.scss"
import { Grid, Row, Col } from 'armstrong-react';

interface IVirtualListProps extends React.Props<VirtualList> {

}

export class VirtualList extends React.Component<IVirtualListProps, { items?: Array<any>, currentIndex?: number }> {
  // There is a theoretical hard max of 33554428px which equates to 335,544 items at 100px tall
  private scroller: HTMLDivElement;
  private itemHeight = 200;
  private scanAhead = 10;
  private itemCap = 10000;
  private useAnimationRequestFrame = false;
  constructor() {
    super();
    this.state = { items: this.generateItems(), currentIndex: 0 }
  }
  generateItems() {
    let items = [];
    for (var i = 0; i < this.itemCap; i++) {
      items.push({ id: i, content: `Item ${i}`, height: this.itemHeight })
    }
    return items;
  }
  getItemAtOffset(offset: number) {
    let item = Math.round(offset / this.itemHeight);
    this.setState({ currentIndex: item })
  }
  componentDidMount() {
    if (this.useAnimationRequestFrame) {
      this.requestAnimationFrame();
    }
    else {
      this.scroller.onscroll = e => {
        this.getItemAtOffset(this.scroller.scrollTop);
      }
    }
  }
  requestAnimationFrame() {
    window.requestAnimationFrame(() => {
      this.getItemAtOffset(this.scroller.scrollTop);
      this.requestAnimationFrame();
    });
  }
  getRenderable(index: number): boolean {
    let upperLimit = Math.min(this.state.currentIndex + this.scanAhead, this.state.items.length);
    let lowerLimit = Math.max(this.state.currentIndex - this.scanAhead, 0);

    if (index <= upperLimit && index >= lowerLimit) {
      return true;
    }
    return false;
  }
  padOutliers(index: number) {
    let upperLimit = Math.min(this.state.currentIndex + this.scanAhead, this.state.items.length);
    let lowerLimit = Math.max(this.state.currentIndex - this.scanAhead, 0);

    let upperPadding = lowerLimit * this.itemHeight;
    let lowerPadding = (this.state.items.length - upperLimit) * this.itemHeight;

    if (index === upperLimit) {
      return { marginBottom: `${lowerPadding}px` }
    }
    if (index === lowerLimit) {
      return { marginTop: `${upperPadding}px` }
    }
  }
  getComplexTemplate() {
    return (
      <div style={{ height: '100%', backgroundImage: `url('http://lorempixel.com/400/200/')`}}></div>
    )
  }
  render() {
    return (
      <div ref={r => this.scroller = r} className="virtual-list">
        {this.state.items.map((item, index) => {
          if (this.getRenderable(index)) {
            return (
              <div className={`${this.getRenderable(index) ? 'in-view' : ''}`} key={`item_${item.id}`} style={this.padOutliers(index)}>
                {this.getComplexTemplate()}
              </div>
            )
          }
        })
        }
      </div>)
  }
}