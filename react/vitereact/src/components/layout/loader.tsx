import { LoaderFunction } from "react-router-dom";

export type LayoutLoaderData = {
  isSidebarCollapsed: boolean;
};

export const loader: LoaderFunction = () => {
  const isSidebarCollapsed = localStorage.getItem("sidebar/collapsed") === "true";
  return {
    isSidebarCollapsed
  };
};
