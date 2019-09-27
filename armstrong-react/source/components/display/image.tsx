import * as React from "react";
import { Spinner } from "../../../../storybook/src/_symlink";
import InViewport from "../../../../storybook/src/_symlink/components/display/inViewport";
import { ClassHelpers } from "../../utilities/classHelpers";

export interface IImageProps
  extends React.ImgHTMLAttributes<HTMLPictureElement> {
  /** Should the image be circular? */
  rounded?: boolean;
  /** Additional sources - will be set based  */
  alternateSources?: Array<React.HTMLProps<HTMLSourceElement>>;
  /** should the image lazy load */
  lazy?: boolean;
  /** element to render while the image loads */
  loadingChildren?: () => JSX.Element;
  /** callback to execute when the image enters the viewport */
  onEnterViewport?: (entry: IntersectionObserverEntry) => void;
  /** callback to execute when the image exits the viewport */
  onExitViewport?: (entry: IntersectionObserverEntry) => void;
  /** distance from the edge of the screen to load the image (if lazy loading is enabled) */
  rootMargin?: string;
}

export function useRandomUserImageSrc(sampleUserSeed?: string) {
  const [src, setSrc] = React.useState<string>(undefined);

  React.useEffect(() => {
    const url = `https://randomuser.me/api?exc=login,name,location,email,registered,dob,phone,cell,id,nat${
      sampleUserSeed ? `&seed=${sampleUserSeed}` : ""
    }`;

    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        const response = JSON.parse(xmlHttp.responseText);
        const pictureUrl = response.results[0].picture.large;
        setSrc(pictureUrl);
      }
    };

    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
  }, [sampleUserSeed]);

  return src;
}

export function useDummyImageSrc(width: number, height: number) {
  return `http://dummyimage.com/${height}x${width}/4f5c69/ffffff.png`;
}

export const Image: React.FunctionComponent<IImageProps> = (
  props: IImageProps
) => {
  const {
    className,
    rounded,
    src,
    alternateSources,
    lazy,
    loadingChildren,
    onEnterViewport,
    onExitViewport,
    rootMargin,
    ...attrs
  } = props;
  const classes = ClassHelpers.classNames(className, { rounded });

  const [loading, setLoading] = React.useState(true);

  return (
    <InViewport
      once={true}
      IOProps={{ rootMargin }}
      onEnter={onEnterViewport}
      onExit={onExitViewport}
    >
      {({ element, enteredViewport }) => (
        <>
          <picture ref={element} data-loaded={!loading}>
            {(alternateSources || []).map(alternateSource => (
              <source {...alternateSource} />
            ))}

            <img
              {...attrs}
              onLoad={() => setLoading(false)}
              className={classes}
              src={(enteredViewport || !lazy) && src}
            />
          </picture>

          {loading && !!loadingChildren && loadingChildren()}
        </>
      )}
    </InViewport>
  );
};

Image.defaultProps = {
  rootMargin: "200px",
  loadingChildren: () => <Spinner />
};
