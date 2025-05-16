import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "@/routes/layout";
import Dashboard from "@/routes/dashboard/page";
import Packages from "@/routes/packages";
import Engagement from "@/routes/engagement";
import SocialPlatform from "@/routes/socialPlatform";
import Users from "@/routes/user";
import Transactions from "@/routes/transactions";
import Tasks from "@/routes/tasks";
import TaskLog from "@/routes/taskLog";
import Coupon from "@/routes/coupon";
import Login from "@/routes/login";
import Landing from "@/routes/landing";
import { handleLogout } from "./utils/api";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />,
  },
  {
    path: "/dashboard",
    element: isAuthenticated() ? <Layout /> : <Navigate to="/login" replace />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "packages",
        element: <Packages />,
      },
      {
        path: "engagement",
        element: <Engagement />,
      },
      {
        path: "socialPlatform",
        element: <SocialPlatform />,
      },
      {
        path: "coupon",
        element: <Coupon />,
      },
      {
        path: "tasks",
        element: <Tasks />,
      },
      {
        path: "tasksLog",
        element: <TaskLog />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "transactions",
        element: <Transactions />,
      },
      {
        path: "logout",
        loader: () => {
          handleLogout();
          return null;
        },
        element: <Navigate to="/login" replace />
      }
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

function App() {
  return (
    <ThemeProvider storageKey="theme">
      <RouterProvider router={router} />
      <ToastContainer 
        position="top-right" 
        autoClose={1000} 
        hideProgressBar 
        limit={3} 
        newestOnTop 
      />
    </ThemeProvider>
  );
}

export default App;