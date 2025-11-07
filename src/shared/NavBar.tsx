import { Layout, Badge, Avatar, Button } from 'antd';
import { Bell, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import type { RootState } from '../redux/store';
import { logout } from '../redux/features/auth/authSlice';
const { Header } = Layout;

const NavBar = () => {
   const navigate = useNavigate();
   const dispatch = useAppDispatch();
   const currentUser = useAppSelector((state: RootState) => state.auth.user);

   const handleLogout = () => {
      dispatch(logout());
      navigate('/login');
   };

   return (
      <div>
         {currentUser && <Header className="flex items-center justify-between px-6 bg-sidebar">
            <div className="flex items-center gap-3">
               <h1 className="text-xl font-bold text-white m-0">
                  <Link to="/">Mind Mesh AI</Link>
               </h1>
               <Badge count={3} color="red" offset={[0, 2]}>
                  <Button
                     type="text"
                     icon={
                        <Bell
                           size={20}
                           className="transition-colors"
                           style={{ color: "white" }}
                        />
                     }
                     onClick={() => navigate('/notifications')}
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
         </Header>}
      </div>
   );
};

export default NavBar;