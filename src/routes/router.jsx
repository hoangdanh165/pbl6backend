import { lazy, Suspense } from "react";
import { Outlet, createBrowserRouter, Navigate } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import PageLoader from "../components/loading/PageLoader";
import Splash from "../components/loading/Splash";
import { rootPaths } from "./paths";
import paths from "./paths";
import Unauthorized from "../components/Unauthorized";
import Root from "../pages/Root";
import { path } from "d3";

const App = lazy(() => import("../App"));

const AuthLayout = lazy(() => import("../layouts/auth-layout"));
const MainLayout = lazy(() => import("../layouts/main-layout"));

const Login = lazy(() => import("../pages/Login"));
const Home = lazy(() => import("../pages/Home"));
const SignUp = lazy(() => import("../pages/SignUp"));
const ErrorPage = lazy(() => import("../pages/error/ErrorPage"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const UserProfile = lazy(() => import("../pages/UserProfile"));
const ProductList = lazy(() => import("../pages/ProductList"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const CoachDashboard = lazy(() => import("../pages/CoachDashboard"));


const PersistLogin = lazy(() => import("../components/PersistLogin"));
const HomeRedirect = lazy(() => import("../components/HomeRedirect"));

const createMainLayoutRoutes = () => (
  <MainLayout>
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  </MainLayout>
);

const createAuthLayoutRoutes = () => (
  <AuthLayout>
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  </AuthLayout>
);
const routes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<Splash />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" />,
      },
      {
        path: rootPaths.adminRoot,
        element: <PersistLogin>{createMainLayoutRoutes()}</PersistLogin>,

        children: [
          {
            path: paths.dashboard,
            element: (
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            ),
          },

          // {
          //   path: paths.home,
          //   element: <HomeRedirect />,
          // },

          // {
          //   path: paths.profile,
          //   element: (
          //     <PrivateRoute allowedRoles={["customer"]}>
          //       <UserProfile />
          //     </PrivateRoute>
          //   ),
          // },

          // {
          //   path: paths.product,
          //   element: (
          //     <PrivateRoute allowedRoles={["customer"]}>
          //       <ProductList />
          //     </PrivateRoute>
          //   ),
          // },
        ],
       
      },
      {
        paths: rootPaths.coachRoot,
        element: <PersistLogin>{createMainLayoutRoutes()}</PersistLogin>,
        children:[
          {
            path: paths.profile,
            element: (
              <PrivateRoute allowedRoles={["coach"]}>
              <UserProfile />
            </PrivateRoute>
          )
        },
        {
          path: paths.product,
          element: (
            <PrivateRoute allowedRoles={["coach"]}>
              <ProductList />
            </PrivateRoute>
          )
        },
        {
          path: paths.customer,
          element: (
            <PrivateRoute allowedRoles={["coach"]}>
              <CoachDashboard />
            </PrivateRoute>
          )
        }
      ]
    },
      {
        path: rootPaths.root,
        element: (
          <PersistLogin>
            <Root />
          </PersistLogin>
        ),
      },

      {
        path: rootPaths.authRoot,
        element: (
          <AuthLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </AuthLayout>
        ),
        children: [
          {
            path: paths.login,
            element: <Login />,
          },
          {
            path: paths.signup,
            element: <SignUp />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
];

const options = {
  basename: "",
};

const router = createBrowserRouter(routes, options);

export default router;
