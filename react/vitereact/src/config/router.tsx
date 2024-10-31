import ErrorAlert from "@/components/layout/ErrorAlert";
import NotFound from "@/components/layout/NotFound";
import Root from "@/components/layout/Root";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { DEFAULT_ROUTE_PATH } from "@/config/navigation";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  redirect,
  type LoaderFunction
} from "react-router-dom";


import { loader as layoutLoader } from "@/components/layout/loader";
import Welcome from "@/pages/Welcome";
import ProductEfficient from "@/pages/ProductEfficient";

const rootLoader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  return {};
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" loader={rootLoader} element={<Root />} errorElement={<NotFound />}>
      <Route index loader={() => redirect(DEFAULT_ROUTE_PATH)} />
      <Route loader={layoutLoader} element={<SidebarLayout />}>
        <Route path="/welcome" errorElement={<ErrorAlert />} element={<Welcome/>}/>
        <Route path="/react1" errorElement={<ErrorAlert />}/>
        <Route path="/react1/:u" errorElement={<ErrorAlert />}/>
        <Route path="/vue" errorElement={<ErrorAlert />}/>
        <Route path="/vue/:u" errorElement={<ErrorAlert />}/>
        <Route path="/data-management" errorElement={<ErrorAlert />}>
          <Route index loader={() => redirect("/")} />
        </Route>
      </Route>
    </Route>
  )
);

export default router;
