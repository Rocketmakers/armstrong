import * as React from "react";
import { useIntersectionObserver } from "../..";

interface IInViewportChildrenArgs {
  element: React.MutableRefObject<any>;
  enteredViewport?: boolean;
}

interface IInViewportProps {
  IOProps?: IntersectionObserverInit;
  once?: boolean;

  onEnter?: (entry: IntersectionObserverEntry) => void;
  onExit?: (entry: IntersectionObserverEntry) => void;

  children: (props: IInViewportChildrenArgs) => any;
}

export const InViewport: React.FunctionComponent<IInViewportProps> = ({
  once,
  children,
  IOProps,
  onEnter,
  onExit
}) => {
  const [enteredViewport, setEnteredViewport] = React.useState(false);
  const element = React.useRef(null);

  const intersectionCallback = React.useCallback(
    (___, entries: IntersectionObserverEntry[], io: IntersectionObserver) => {
      const entry = entries[0];

      if (entry.isIntersecting) {
        setEnteredViewport(true);

        if (once) {
          io.unobserve(element.current);
        }

        if (!!onEnter) {
          onEnter(entry);
        }
      } else {
        setEnteredViewport(false);

        if (!!onExit) {
          onExit(entry);
        }
      }
    },
    [once, onEnter, onExit]
  );

  useIntersectionObserver(element, intersectionCallback, IOProps);

  return children({ element, enteredViewport });
};

InViewport.defaultProps = {
  IOProps: {
    rootMargin: "-50px",
    threshold: 0.4
  },
  once: false
};

export default InViewport;
