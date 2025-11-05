import { Form, Input, Button, Card, Typography, Space } from 'antd';
import { Mail, Lock } from 'lucide-react';
import { useLoginMutation } from '../redux/features/auth/authApi';
import { toast } from 'sonner';
import { verifyToken } from '../utils/verifyToken';
import { useAppDispatch } from '../redux/hooks';
import { setUser, type TUser } from '../redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
const { Title, Text, Link } = Typography;

const Login = () => {
   const navigate = useNavigate();
   const [login] = useLoginMutation();
   const dispatch = useAppDispatch();

   const onFinish = async (values: { email: string; password: string }) => {
      const toastId = toast.loading('Loggin in');
      try {
         const userInfo = {
            email: values.email,
            password: values.password
         }

         const res = await login(userInfo).unwrap();
         const user = verifyToken(res.data.accessToken) as TUser;
         dispatch(setUser({ user: user, token: res.data.accessToken }));
         navigate(`/`);
         toast.success('Logged In Successfully', { id: toastId });
      }
      catch {
         toast.error('Something went wrong', { id: toastId });
      }
   };

   return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
         <Card className="w-full max-w-md shadow-lg">
            <Space direction="vertical" size="large" className="w-full">
               <div className="text-center">
                  <Title level={2} className="m-0">Welcome Back</Title>
                  <Text type="secondary">Sign in to continue to Mind Mesh AI</Text>
               </div>

               <Form
                  name="login"
                  layout="vertical"
                  autoComplete="off"
                  size="large"
                  onFinish={onFinish}
               >
                  <Form.Item
                     name="email"
                     rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' },
                     ]}
                  >
                     <Input
                        prefix={<Mail size={16} />}
                        placeholder="Email"
                     />
                  </Form.Item>

                  <Form.Item
                     name="password"
                     rules={[{ required: true, message: 'Please input your password!' }]}
                  >
                     <Input.Password
                        prefix={<Lock size={16} />}
                        placeholder="Password"
                     />
                  </Form.Item>

                  <Form.Item>
                     <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                     >
                        Sign In
                     </Button>
                  </Form.Item>
               </Form>

               <div className="text-center">
                  <Space className="mt-2">
                     <Text>Don't have an account?</Text>
                     <Link>Sign up</Link>
                  </Space>
               </div>
            </Space>
         </Card>
      </div>
   );
};

export default Login;
