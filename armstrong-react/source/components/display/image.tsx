import * as React from "react";
import { ClassHelpers } from "../../utilities/classNames";

export interface IImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
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

export class Image extends React.Component<IImageProps, { source?: string }> {
  constructor(props: IImageProps) {
    super(props);
    this.state = { source: "" };
  }
  getRandomUser() {
    const { sampleUserSeed } = this.props
    const url = `https://randomuser.me/api?exc=login,name,location,email,registered,dob,phone,cell,id,nat${sampleUserSeed ? `&seed=${sampleUserSeed}` : ""}`;
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        const response = JSON.parse(xmlHttp.responseText);
        const pictureUrl = response.results[0].picture.large;
        this.setState({ source: pictureUrl });
      }
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
  }

  componentDidMount() {
    let { height, width } = this.props
    const { sampleUser, source, noPlaceholder } = this.props
    if (!height && width) {
      height = width;
    }
    if (!width && height) {
      width = height;
    }

    if (source) {
      this.setState({ source });
    } else if (sampleUser) {
      this.getRandomUser();
    } else if (!noPlaceholder && !sampleUser) {
      this.setState({ source: `http://dummyimage.com/${height}x${width}/4f5c69/ffffff.png` });
    }
  }

  render() {
    const { height, width, noPlaceholder, sampleUserSeed, sampleUser, source, className, rounded, ...attrs } = this.props
    const classes = ClassHelpers.classNames(className, { rounded });
    return (
      <img src={this.state.source} {...attrs} height={height} width={width} className={classes} />
    );
  }
}
