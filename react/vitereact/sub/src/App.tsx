import { createContext, useRef } from "react";
import { add } from "sdlin-utils";
// import { useSearchParam } from "react-use";

export const SUBViewerContext = createContext<HTMLDivElement | null>(null);


const App = () => {
  // const md5 = useSearchParam("md5");
  const SUBViewerRef = useRef<HTMLDivElement | null>(null);
  return (
    <SUBViewerContext.Provider value={SUBViewerRef.current}>
      inner program
      <div>
        monorepo使用子项目
        use add.js to add 1 + 2 = {add(1, 2)}
      </div>
    </SUBViewerContext.Provider>
  );
};

export default App;
