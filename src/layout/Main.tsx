import { Layout, Badge, Dropdown, Avatar, Button, Space } from 'antd';
import { Bell, Plus, User } from 'lucide-react';
import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import type { RootState } from '../redux/store';
const { Header, Content } = Layout;

const Main = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const currentUser = useSelector((state: RootState) => state.auth.user);

   // const userMenuItems = {
   //    items: [
   //       {
   //          key: 'profile',
   //          label: 'Profile',
   //          icon: <User size={16} />,
   //          onClick: () => navigate('/profile'),
   //       },
   //       {
   //          key: 'settings',
   //          label: 'Settings',
   //          icon: <Settings size={16} />,
   //       },
   //       {
   //          type: 'divider' as const,
   //       },
   //       {
   //          key: 'logout',
   //          label: 'Logout',
   //          icon: <LogOut size={16} />,
   //          onClick: logout,
   //       },
   //    ],
   // };

   return (
      <Layout style={{ minHeight: '100vh' }}>
         <Header className="flex items-center justify-between px-6 bg-sidebar">
            <div className="flex items-center gap-4">
               <h1 className="text-xl font-bold text-sidebar-foreground m-0 text-white">
                  <Link to="/">Mind Mesh AI</Link>
               </h1>
            </div>

            <Space size="middle">

               <Badge offset={[-5, 5]}>
                  <Button
                     type="text"
                     icon={<Bell size={18} className="text-sidebar-foreground bg-amber-50" />}
                     onClick={() => navigate('/notifications')}
                  />
               </Badge>


               <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                  <Avatar

                     icon={<User />}
                     size="default"
                  />
                  <span className="text-sidebar-foreground hidden md:inline text-white">
                     {currentUser?.userName}
                  </span>
               </Link>

            </Space>
         </Header>

         <Layout>
            <Content className="bg-background p-6">
               <div className="max-w-7xl mx-auto">
                  <Outlet></Outlet>
               </div>
            </Content>
         </Layout>
      </Layout >
   );
};

export default Main;
