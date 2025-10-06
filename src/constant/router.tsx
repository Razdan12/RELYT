import { createBrowserRouter } from "react-router-dom";
import { listed } from "./listed";

import HomePage from "../pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/userArea/Dashboard";
import Webhook from "@/pages/userArea/Webhook";
import Settings from "@/pages/userArea/Settings";
import AddMember from "@/pages/userArea/AddMember";
import Members from "@/pages/userArea/Members";
import Notfound from "@/pages/Notfound";
import RegisterPage from "@/pages/RegisterPage";
import LayoutAdmin from "@/components/Layout";
import { ChecksList } from "@/pages/userArea/CheckList";
import Incident from "@/pages/userArea/Incident";

const Route: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "*",
    element: <Notfound/>,
  },
  {
    path: listed.login,
    element: <LoginPage />,
  },
  {
    path: listed.register,
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <LayoutAdmin/>,
    children: [
      {
        path: listed.dashboard,
        element: <Dashboard />,
      },
      {
        path: listed.webhook,
        element: <Webhook />,
      },
      {
        path: listed.members,
        element: <Members />,
      },
      {
        path: listed.addMember,
        element: <AddMember />,
      },
      {
        path: listed.settings,
        element: <Settings />,
      },
      {
        path: listed.http,
        element: <ChecksList />,
      },
      {
        path: listed.incident,
        element: <Incident />,
      },
     
    ],
  },
]);

export default Route;
