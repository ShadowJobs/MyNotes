import { createContext, useRef } from "react";
// import { useSearchParam } from "react-use";

export const SUBViewerContext = createContext<HTMLDivElement | null>(null);


const App = () => {
  // const md5 = useSearchParam("md5");
  const SUBViewerRef = useRef<HTMLDivElement | null>(null);
  return (
    <SUBViewerContext.Provider value={SUBViewerRef.current}>
      inner program
    </SUBViewerContext.Provider>
  );
};

export default App;
