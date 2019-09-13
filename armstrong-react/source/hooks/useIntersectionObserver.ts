import * as React from "react";

/**
 * Use an intersection observer to fire the passed callback upon intersection - also cleans up on unmount
 * @param ref the html element to watch
 * @param callback the callback to be fired
 * @param options an intersection observer options object
 */

export const useIntersectionObserver = (
  ref: React.MutableRefObject<HTMLElement>,
  callback: (
    isIntersecting: boolean,
    entries: IntersectionObserverEntry[],
    io: IntersectionObserver,
  ) => any,
  options?: IntersectionObserverInit,
) => {
  const io = React.useRef<IntersectionObserver>(null);

  React.useEffect(() => {
    if (!!ref && !!ref.current) {
      io.current = new IntersectionObserver(
        (entries, observer) =>
          callback(entries[0].isIntersecting, entries, observer),
        options,
      );
      io.current.observe(ref.current);

      return () => io.current.unobserve(ref.current);
    }
  }, [ref]);
};
