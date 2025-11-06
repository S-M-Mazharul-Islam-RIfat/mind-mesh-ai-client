import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import CreateThread from "../pages/Thread/CreateThread";
import ThreadList from "../pages/Thread/ThreadList";
import ThreadDetail from "../pages/Thread/ThreadDetail";
import Profile from "../pages/Profile/Profile";

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
            element: <CreateThread></CreateThread>
         },
         {
            path: '/thread/:threadId',
            element: <ThreadDetail></ThreadDetail>
         },
         {
            path: 'profile',
            element: <Profile></Profile>
         },
         {
            path: 'login',
            element: <Login></Login>
         },
         {
            path: 'signup',
            element: <Signup></Signup>
         },
      ]
   },
]);

export default router;