import { Form, Input, Button, Card, Typography, Space } from 'antd';
import { User, Mail, Lock } from 'lucide-react';
import { useSignupMutation } from '../redux/features/auth/authApi';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
const { Title, Text } = Typography;

const Signup = () => {
  const navigate = useNavigate();
  const [signup] = useSignupMutation();

  const onFinish = async (values: { fullName: string; userName: string; email: string; password: string }) => {
    const toastId = toast.loading('Signning in');
    try {
      const userInfo = {
        fullName: values.fullName,
        userName: values.userName,
        email: values.email,
        password: values.password
      }
      await signup(userInfo).unwrap();
      navigate(`/login`);
      toast.success('Sign In Successfully', { id: toastId });
    }
    catch {
      toast.error('Something went wrong', { id: toastId });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background mx-auto">
      <Card className="w-full max-w-md shadow-lg">
        <Space direction="vertical" size="large" className="w-full">
          <div className="text-center">
            <Title level={2} className="m-0">Create Account</Title>
          </div>
          <Form
            name="signup"
            layout="vertical"
            autoComplete="off"
            size="large"
            onFinish={onFinish}
          >
            <Form.Item
              name="fullName"
              rules={[
                { required: true, message: 'Please input your full name!' },
                { min: 3, message: 'Username must be at least 6 characters!' },
              ]}
            >
              <Input
                prefix={<User size={16} />}
                placeholder="Full name"
              />
            </Form.Item>
            <Form.Item
              name="userName"
              rules={[
                { required: true, message: 'Please input your username!' },
                { min: 3, message: 'Username must be at least 3 characters!' },
              ]}
            >
              <Input
                prefix={<User size={16} />}
                placeholder="Username"
              />
            </Form.Item>
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
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' },
              ]}
            >
              <Input.Password
                prefix={<Lock size={16} />}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item
              name="confirm"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<Lock size={16} />}
                placeholder="Confirm Password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>
          <div className="text-center">
            <Space>
              <Text>Already have an account?</Text>
              <Link to="/login">Login</Link>
            </Space>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Signup;
