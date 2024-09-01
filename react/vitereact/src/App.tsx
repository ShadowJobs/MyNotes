import queryClient from "@/utils/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { App as AntdProvider, ConfigProvider } from "antd";
import enUS from "antd/es/locale/en_US";
import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";
import router from "./config/router";

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            token: { colorPrimary: "#0068EB" }
          }}
          locale={enUS}
        >
          <AntdProvider>
            <RouterProvider router={router} />
          </AntdProvider>
        </ConfigProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
