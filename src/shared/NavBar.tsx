import { useEffect } from 'react';
import { Layout, Badge, Avatar, Button, Tooltip } from 'antd';
import { Bell, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import type { RootState } from '../redux/store';
import { logout } from '../redux/features/auth/authSlice';
import { socket } from '../utils/socket';
import { toast } from 'sonner';
import { clearNotificationCount, incrementNotificationCount } from '../redux/features/notification/notificationSlice';
import type { TNotification } from '../types/notification.type';
const { Header } = Layout;

const NavBar = () => {
   const navigate = useNavigate();
   const dispatch = useAppDispatch();
   const currentUser = useAppSelector((state: RootState) => state.auth.user);
   const currentNotificationCount = useAppSelector((state: RootState) => state.notifications.count);

   useEffect(() => {
      if (currentUser?.id) {
         // only register user when they log in or change
         socket.emit("register_user", currentUser.id);
      }
   }, [currentUser?.id]);

   useEffect(() => {
      // use a stable listener function
      const handleNotification = (data: Partial<TNotification>) => {
         toast.info(data.message, { position: "top-right", duration: 3000 });
         dispatch(incrementNotificationCount());
      };

      // add listener only once when the component mounts
      socket.on("notification", handleNotification);

      return () => {
         // remove exactly that listener
         socket.off("notification", handleNotification);
      };
   }, [dispatch]);

   const handleLogout = () => {
      dispatch(logout());
      navigate('/login');
   };

   const handleNotificationClick = () => {
      dispatch(clearNotificationCount());
      navigate('/notifications');
   };

   return (
      <Header className="flex items-center justify-between px-6 bg-sidebar">
         <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white m-0">
               <Link to="/">Mind Mesh AI</Link>
            </h1>
            {
               currentUser && <Badge
                  count={currentNotificationCount}
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
            }
         </div>
         <div className="flex items-center gap-3">
            {currentUser ? (
               <>
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
                        {currentUser.userName}
                     </span>
                  </Link>
                  <Tooltip title="Logout">
                     <Button
                        type="text"
                        danger
                        size="small"
                        icon={<LogOut size={16} />}
                        onClick={handleLogout}
                        className="text-white hover:text-red-400 transition"
                     />
                  </Tooltip>
               </>
            ) : (
               <Link to="/login">
                  <Button type="primary" size="large" block>
                     Login
                  </Button>
               </Link>
            )}
         </div>
      </Header>
   );
};

export default NavBar;
