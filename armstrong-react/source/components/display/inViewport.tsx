import * as React from "react";

interface IInViewportChildrenArgs {
  element: React.MutableRefObject<any>;
  enteredViewport?: boolean;
}

interface IInViewportProps {
  IOProps?: IntersectionObserverInit;
  once?: boolean;
  children: (props: IInViewportChildrenArgs) => any;
}

export const InViewport: React.FunctionComponent<IInViewportProps> = props => {
  const { once, children, IOProps } = props;

  const [enteredViewport, setEnteredViewport] = React.useState(false);
  const element = React.useRef(null);

  let observer: IntersectionObserver;

  React.useEffect(() => {
    if (!!element && element.current) {
      observer = new IntersectionObserver(
        (entries, io) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            setEnteredViewport(true);
            if (once) {
              io.unobserve(element.current);
            }
          } else {
            setEnteredViewport(false);
          }
        },
        {
          ...IOProps
        }
      );

      observer.observe(element.current);

      return () => {
        if (!!element && element.current) {
          observer.unobserve(element.current);
        }
      };
    }
  }, [element]);

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
