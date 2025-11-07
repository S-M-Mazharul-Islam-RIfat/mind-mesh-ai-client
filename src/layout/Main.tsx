import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import NavBar from '../shared/NavBar';
const { Content } = Layout;

const Main = () => {
   return (
      <Layout style={{ minHeight: '100vh' }}>
         <NavBar></NavBar>
         <Layout>
            <Content className="bg-background p-6">
               <div className="max-w-7xl mx-auto">
                  <Outlet />
               </div>
            </Content>
         </Layout>
      </Layout>
   );
};

export default Main;
