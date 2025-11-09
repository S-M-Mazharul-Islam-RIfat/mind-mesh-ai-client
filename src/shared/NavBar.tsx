import { memo, useEffect, useState } from 'react';
import { Layout, Badge, Avatar, Button } from 'antd';
import { Bell, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import type { RootState } from '../redux/store';
import { logout } from '../redux/features/auth/authSlice';
import { socket } from '../utils/socket';
import { toast } from 'sonner';
const { Header } = Layout;

const NavBar = () => {
   const navigate = useNavigate();
   const dispatch = useAppDispatch();
   const currentUser = useAppSelector((state: RootState) => state.auth.user);
   const [notificationCount, setNotificationCount] = useState(0);

   useEffect(() => {
      if (currentUser?.id) {
         // only register user when they log in or change
         socket.emit("register_user", currentUser.id);
      }
   }, [currentUser?.id]);

   useEffect(() => {
      console.log("here");
      // use a stable listener function
      const handleNotification = (data: any) => {
         console.log("Notification received:", data);
         toast.info(data.message, { position: "top-right", duration: 3000 });
         setNotificationCount((prev) => prev + 1);
      };

      // add listener only once when the component mounts
      socket.on("notification", handleNotification);

      return () => {
         // remove exactly that listener
         socket.off("notification", handleNotification);
      };
   }, []);


   const handleLogout = () => {
      dispatch(logout());
      navigate('/login');
   };

   const handleNotificationClick = () => {
      setNotificationCount(0);
      navigate('/notifications');
   };

   return (
      <Header className="flex items-center justify-between px-6 bg-sidebar">
         <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white m-0">
               <Link to="/">Mind Mesh AI</Link>
            </h1>
            <Badge
               count={notificationCount}
               color="red"
               offset={[0, 2]}
               overflowCount={99}
            >
               <Button
                  type="text"
                  icon={
                     <Bell
                        size={20}
                        className="transition-colors"
                        style={{ color: "white" }}
                     />
                  }
                  onClick={handleNotificationClick}
               />
            </Badge>
         </div>
         <div className="flex items-center gap-3">
            <Link
               to="/profile"
               className="flex items-center hover:opacity-80 transition"
            >
               <Avatar
                  icon={<User size={20} />}
                  size="small"
                  className="border border-gray-500"
               />
               <span className="hidden md:inline text-[1rem] text-white font-medium">
                  {currentUser?.userName}
               </span>
            </Link>
            <Button
               type="text"
               danger
               size="small"
               icon={<LogOut size={16} />}
               onClick={handleLogout}
               className="text-white hover:text-red-400 transition"
            />
         </div>
      </Header>
   );
};

export default memo(NavBar);
