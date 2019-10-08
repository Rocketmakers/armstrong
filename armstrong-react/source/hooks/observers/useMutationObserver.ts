import * as React from 'react'

/**
 * Hook to add a mutation observer to an element by returning a react ref
 *
 * A mutation observer listens to the changes to the DOM structure of the children of the ref
 *
 * @param callback the callback to fire on mutation
 * @param options options to pass into the mutation observer
 */

export const useMutationObserver = (callback: MutationCallback, options: MutationObserverInit, ref: HTMLElement) => {
  // const ref = React.useRef<HTMLElement & HTMLDivElement>(null)
  const mutationObserver = React.useRef<MutationObserver>(null)

  React.useLayoutEffect(() => {
    mutationObserver.current = new MutationObserver(callback)

    if (ref) {
      mutationObserver.current.observe(ref, options)
    }

    return () => ref && mutationObserver.current.disconnect()
  }, [ref, callback, options])
}
