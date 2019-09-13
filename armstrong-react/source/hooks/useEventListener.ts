import * as React from "react";

/**
 * hook to add an event listener, and remove it when the component unmounts
 *
 * @param eventHandler the callback to run when the event fires
 * @param type the name of the event to listen to
 * @param element the element to add the listener to, defaults to window
 */

export const useEventListener = (
  type: string,
  eventHandler: (e: Event) => any,
  element: Pick<HTMLElement, "addEventListener" | "removeEventListener"> = typeof window === undefined ? null : window,
) => {
  React.useEffect(() => {
    /// CHECK FOR SSR
    if (!!element) {
      element.addEventListener(type, eventHandler, { passive: true });

      return () => {
        element.removeEventListener(type, eventHandler);
      };
    }
  }, [eventHandler]);
};
