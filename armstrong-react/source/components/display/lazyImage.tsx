import * as React from "react";

import { ClassHelpers } from "../..";
import InViewport from "./inViewport";
import "./lazyImage.scss";

interface ILazyImageProps extends React.HTMLAttributes<HTMLImageElement> {
  loaderColourVariant?: "white" | "black" | "brand";

  rootMargin?: string;
  src: string;
  placeholderSrc?: string;
  alt: string;

  loadingChildren?: JSX.Element
}

export const LazyImage: React.FunctionComponent<ILazyImageProps> = ({
  rootMargin,
  src,
  className,
  placeholderSrc,
  loaderColourVariant,
  loadingChildren,
  ...attrs
}) => {
  const [loading, setLoading] = React.useState(true);

  return (
    <InViewport once={true} IOProps={{ rootMargin }}>
      {({ element, enteredViewport }) => (
        <>
          <img
            className={ClassHelpers.classNames(className, "lazy-image")}
            src={enteredViewport ? src : placeholderSrc || ""}
            ref={element}
            data-entered-viewport={enteredViewport}
            crossOrigin="use-credentials"
            onLoad={() => setLoading(false)}
            data-loaded={!loading}
            {...attrs}
          />

          {loading && loadingChildren}
        </>
      )}
    </InViewport>
  );
};

LazyImage.defaultProps = {
  rootMargin: "200px",
  loaderColourVariant: "black"
};

export default LazyImage;
