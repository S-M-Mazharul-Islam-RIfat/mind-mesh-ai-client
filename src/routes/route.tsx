import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import CreateThread from "../pages/Thread/CreateThread";
import ThreadList from "../pages/Thread/ThreadList";
import ThreadDetail from "../pages/Thread/ThreadDetail";
import Profile from "../pages/Profile/Profile";
import Notification from "../pages/Notification/Notification";
import PrivateRoute from "./PrivateRoute";
import ErrorBoundary from "../shared/ErrorBoundary";

const router = createBrowserRouter([
   {
      path: '/',
      element: <Main></Main>,
      children: [
         {
            path: '/',
            element: <ThreadList></ThreadList>
         },
         {
            path: '/create-thread',
            element: <PrivateRoute role="user"><CreateThread></CreateThread></PrivateRoute>
         },
         {
            path: '/thread/:threadId',
            element: <PrivateRoute role="user"><ErrorBoundary><ThreadDetail></ThreadDetail></ErrorBoundary></PrivateRoute>
         },
         {
            path: '/profile',
            element: <PrivateRoute role="user"><Profile></Profile></PrivateRoute>
         },
         {
            path: '/notifications',
            element: <PrivateRoute role="user"><Notification></Notification></PrivateRoute>
         },
         {
            path: '/login',
            element: <Login></Login>
         },
         {
            path: '/signup',
            element: <Signup></Signup>
         },
      ]
   },
]);

export default router;