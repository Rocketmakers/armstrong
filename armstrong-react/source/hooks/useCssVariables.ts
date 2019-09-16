import * as React from "react";

interface ICSSVariable {
  name: string;
  value: any;
  enabled?: boolean;
  priority?: string;
}

export const useCSSVariables = (
  variables: ICSSVariable[],
) => {
    const element = React.useRef<React.DetailedHTMLProps<any, HTMLElement>>(null)

  React.useEffect(() => {
    if (element.current) {
      variables.forEach(variable => {
        if (
          (variable.enabled || variable.enabled === undefined) &&
          !!variable.value
        ) {
          element.current.style.setProperty(
            variable.name,
            variable.value,
            variable.priority
          );
        }
      });
    }
  }, [element, variables]);

  return element
};
