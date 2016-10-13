import * as React from "react";
import * as _ from "underscore";
import * as classNames from "classnames";
import { Color, LayoutHelpers } from "./../../utilities/uiHelpers";
import { Icons } from "./../../utilities/icons";

export interface IImageProps extends React.HTMLProps<Image> {
  /** (boolean) Should the image be circular? */
  rounded?: boolean;
  /** (string) CSS classname property */
  className?: string;
  /** (string) A file or url path to an image */
  source?: string;
  /** (boolean) Should this image be of a sample user? */
  sampleUser?: boolean;
  /** (string) Any fixed value here will ensure the same sample user is returned */
  sampleUserSeed?: string;
  /** (number) The height in pixels of the image */
  height?: number;
  /** (number) The width in pixels of the image */
  width?: number;
  /** (boolean) Set to true to disable placeholders when no src is provided */
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
