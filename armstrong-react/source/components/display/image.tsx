import * as React from "react";
import { ClassHelpers } from "../../utilities/classHelpers";

export interface IImageProps extends React.ImgHTMLAttributes<HTMLPictureElement> {
  /** Should the image be circular? */
  rounded?: boolean;
  /** WEBP source */
  webpSrc?: string;
}

export function useRandomUserImageSrc(sampleUserSeed?: string) {
  const [src, setSrc] = React.useState<string>(undefined)
  React.useMemo(() => {
    const url = `https://randomuser.me/api?exc=login,name,location,email,registered,dob,phone,cell,id,nat${sampleUserSeed ? `&seed=${sampleUserSeed}` : ""}`;
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        const response = JSON.parse(xmlHttp.responseText);
        const pictureUrl = response.results[0].picture.large;
        setSrc(pictureUrl)
      }
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
    return
  }, [sampleUserSeed])
  return src
}

export function useDummyImageSrc(width: number, height: number) {
  return `http://dummyimage.com/${height}x${width}/4f5c69/ffffff.png`
}

export function Image(props: IImageProps) {
  const { className, rounded, src, webpSrc, ...attrs } = props
  const classes = ClassHelpers.classNames(className, { rounded });
  return (
    <picture>
      {webpSrc && <source srcSet={webpSrc} type="image/webp"></source>}
      <img {...attrs} className={classes} src={src} />
    </picture>
  )
}
