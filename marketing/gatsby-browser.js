import React from "react"
import { GlobalContextProvider } from "./src/context/globalContext"
export const wrapRootElement = ({ element }) => (
  <GlobalContextProvider>{element}</GlobalContextProvider>
)