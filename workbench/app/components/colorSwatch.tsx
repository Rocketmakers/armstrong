import * as React from "react";

import "./colorSwatch.scss";

interface IColorSwatchProps extends React.Props<ColorSwatch> {
  className: string;
  name: string;
  onClick?: () => void;
  selected: boolean;
}

export class ColorSwatch extends React.Component<IColorSwatchProps, { color: string }> {
  constructor() {
    super();
    this.state = { color: "" };
  }
  rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
      return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  }
  componentDidMount() {
    var swatch = this.refs["swatch"] as HTMLDivElement;
    window.setTimeout(() => {
      this.setState({ color: this.rgb2hex(window.getComputedStyle(swatch).backgroundColor) })
    }, 250)
  }
  render() {
    return <div className={`swatch-wrapper${this.props.selected ? ' selected' : ''}`} onClick={this.props.onClick}>
      <div ref="swatch" className={`swatch bg-${this.props.className}`}><div>{this.state.color}</div></div>
      <label className="m-top-xsmall m-bottom-xsmall">{this.props.name}</label>

      <label className={`bg-${this.props.className}`}>bg-{this.props.className}</label>
      <label className={`fg-${this.props.className}`}>fg-{this.props.className}</label>
    </div>
  }
}