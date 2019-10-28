import * as React from "react";

import { useTimeout } from "../..";
import { ClassHelpers } from "../../utilities/classHelpers";
import { Icon } from "./icon";
import InViewport from "./inViewport";
import { Spinner } from "./spinner";

export interface IImageProps
  extends React.ImgHTMLAttributes<HTMLPictureElement> {
  /** Should the image be circular? */
  rounded?: boolean;

  /** Additional sources - will be set based  */
  alternateSources?: Array<React.HTMLProps<HTMLSourceElement>>;

  /** should the image lazy load */
  lazy?: boolean;

  /** callback to execute when the image enters the viewport */
  onEnterViewport?: (entry: IntersectionObserverEntry) => void;

  /** callback to execute when the image exits the viewport */
  onExitViewport?: (entry: IntersectionObserverEntry) => void;

  /** distance from the edge of the screen to load the image (if lazy loading is enabled) */
  rootMargin?: string;

  /** render a spinner that will centre itself in the img's parent until the image has loaded */
  renderSpinner?: boolean;

  /** override the default spinner to be rendered if renderSpinner is set to true */
  spinnerElement?: JSX.Element;

  /** render an element if there is an error loading the image */
  renderError?: boolean;

  /** the elemnt to render if renderError is set to true and there is an error loading the image */
  errorElement?: JSX.Element;

  /** if renderSpinner is set to true, the amount of time to wait before rendering a spinner in ms (stops the spinner from flashing onto the screen quickly if the image is tiny) - defaults to 500 */
  minimumTimeToSpinner?: number;
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
    onEnterViewport,
    onExitViewport,
    rootMargin,
    renderSpinner,
    spinnerElement,
    renderError,
    errorElement,
    minimumTimeToSpinner,
    ...attrs
  } = props;
  const classes = ClassHelpers.classNames(className, { rounded });

  const [loaded, setLoaded] = React.useState(false);
  const [spinnerReady, setSpinnerReady] = React.useState();
  const [errored, setErrored] = React.useState(false);

  const imgRef = React.useRef<HTMLImageElement>(null);

  const { set } = useTimeout(() => setSpinnerReady(true), minimumTimeToSpinner);

  const onLoad = React.useCallback(() => {
    setLoaded(true);
  }, []);

  const onError = React.useCallback(() => {
    setErrored(true);
    setLoaded(true);
  }, []);

  React.useLayoutEffect(() => {
    // check if image is cached and run onLoad if it is - (load event does not fire if image is already loaded in another img)
    if (imgRef.current && imgRef.current.complete) {
      onLoad();
    }
  }, [onLoad]);

  return (
    <InViewport
      once={true}
      IOProps={{ rootMargin }}
      onEnter={entry => {
        set();
        onEnterViewport(entry);
      }}
      onExit={onExitViewport}
    >
      {({ element, enteredViewport }) => (
        <>
          {errored && renderError && !!errorElement && errorElement}

          <picture
            className="armstrong-picture"
            ref={element}
            data-loaded={loaded}
          >
            {(enteredViewport || !lazy) && (
              <>
                {(alternateSources || []).map(alternateSource => (
                  <source
                    {...alternateSource}
                    key={JSON.stringify(alternateSource)}
                  />
                ))}

                <img
                  {...attrs}
                  onLoad={onLoad}
                  onError={onError}
                  className={classes}
                  src={enteredViewport || !lazy ? src : ""}
                  ref={imgRef}
                />
              </>
            )}
          </picture>

          {!loaded &&
            renderSpinner &&
            spinnerReady &&
            !!spinnerElement &&
            spinnerElement}
        </>
      )}
    </InViewport>
  );
};

Image.defaultProps = {
  rootMargin: "200px",
  spinnerElement: <Spinner className='armstrong-picture-spinner' />,
  errorElement: (
    <div className="image-not-found">
      <Icon icon={Icon.Icomoon.warning} />
      <p>Image not found</p>
    </div>
  ),
  renderSpinner: false,
  renderError: false,
  minimumTimeToSpinner: 500
};
