import * as React from "react";


interface IContextState {
  isMobileSize: boolean;
}

export const defaultState: IContextState = {
  isMobileSize: false
};

const GlobalContext = React.createContext(defaultState)

export const GlobalContextProvider: React.FunctionComponent = props => {
  const [isMobileSize, setisMobileSize] = React.useState<boolean>(false);

  const handleSizeChange = React.useCallback((x: MediaQueryList) => {
    setisMobileSize(!x.matches);
  }, []);

  // Watch for mobile
  React.useEffect(() => {
    const x = window.matchMedia("(min-width: 600px)");
    handleSizeChange(x);
    x.addListener(() => handleSizeChange(x));

    return () => {
      x.removeListener(() => handleSizeChange)
    }
  }, [])



  return (
    <GlobalContext.Provider value={{ isMobileSize }}>
      {props.children}
    </GlobalContext.Provider>
  )
}

export default GlobalContext