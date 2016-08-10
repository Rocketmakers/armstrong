import * as React from "react";
import * as _ from "underscore";
import * as classNames from "classnames";
import { Color, LayoutHelpers } from "./../../utilities/uiHelpers";
import { Icons } from "./../../utilities/icons";

export interface IImageProps extends React.HTMLProps<Image> {
  rounded?: boolean;
  className?: string;
  source?: string;
  sampleUser?: boolean;
  sampleUserSeed?: string;
  height?: number;
  width?: number;
  noPlaceholder?: boolean;
}

export class Image extends React.Component<IImageProps, { source?: string }>{
  constructor() {
    super();
    this.state = { source: "" };
  }
  getRandomUser() {
    var _this = this;
    var url = `http://api.randomuser.me/?exc=login,name,location,email,registered,dob,phone,cell,id,nat${this.props.sampleUserSeed ? `&seed=${this.props.sampleUserSeed}` : ''}`;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var response = JSON.parse(xmlHttp.responseText);
        var pictureUrl = response.results[0].picture.large;
        _this.setState({ source: pictureUrl });
      }
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
  }
  componentDidMount() {
    var height = this.props.height;
    var width = this.props.width;
    if (!this.props.height && this.props.width){
      height = this.props.width;
    }
    if (!this.props.width && this.props.height){
      width = this.props.height;
    }

    var source;
    if (this.props.source){
      this.setState({ source: this.props.source});
    }
    else if (this.props.sampleUser) {
      this.getRandomUser();
    }
    else if (!this.props.noPlaceholder && !this.props.sampleUser) {
      this.setState({ source: `http://dummyimage.com/${height}x${width}/4f5c69/ffffff.png`});
    }
  }
  render() {
    var attrs = _.omit(this.props, "height", "width", "noPlaceholder", "sampleUserSeed", "sampleUser", "source", "className", "rounded");
    return (
      <img src={this.state.source} { ...attrs } height={this.props.height} width={this.props.width} className={classNames(this.props.className, { "rounded": this.props.rounded }) }/>
    );
  }
}
