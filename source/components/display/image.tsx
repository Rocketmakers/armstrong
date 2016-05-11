import * as React from "react";
import { classNames, cd } from "./../../utilities/classBuilder";
import { Color, LayoutHelpers } from "./../../utilities/uiHelpers";
import { Icons } from "./../../utilities/icons";

export interface IImageProps extends React.HTMLProps<Image> {
  rounded?: boolean;
  className?: string;
  source?: string;
  sampleUser?: boolean;
  height: number;
  width: number;
  seed?: string;
}
export class Image extends React.Component<IImageProps, { profileUrl: string }>{
  constructor() {
    super();
    this.state = { profileUrl: "" };
  }
  getRandomUser() {
    var _this = this;
    var url = `http://api.randomuser.me/?exc=login,name,location,email,registered,dob,phone,cell,id,nat${this.props.seed ? `&seed=${this.props.seed}` : ''}`;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var response = JSON.parse(xmlHttp.responseText);
        var pictureUrl = response.results[0].picture.large;
        _this.setState({ profileUrl: pictureUrl });
      }
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
  }
  render() {
    var source = this.props.source || `http://dummyimage.com/${this.props.height}x${this.props.width}/4f5c69/ffffff.png`;
    if (!this.props.source && this.props.sampleUser && !this.state.profileUrl) {
      this.getRandomUser();
    }
    if (this.props.sampleUser && this.state.profileUrl){
      source = this.state.profileUrl;
    }
    return (
      <img src={source} { ...this.props as any } height={this.props.height} width={this.props.width} className={classNames(this.props.className, cd("rounded", this.props.rounded)) }/>
    );
  }
}
