import { useState } from 'react';
import {
   Card,
   Typography,
   Avatar,
   Space,
   Tag,
   Descriptions,
   Statistic,
   Row,
   Col,
   Modal,
   Form,
   Input,
   Button,
} from 'antd';
import { Mail, Calendar, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { RootState } from '../../redux/store';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { toast } from 'sonner';
import { useChangePasswordMutation, useChangeUserInfoMutation } from '../../redux/features/auth/authApi';
import { logout } from '../../redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Profile = () => {
   const navigate = useNavigate();
   const currentUser = useAppSelector((state: RootState) => state.auth.user);
   const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
   const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
   const [isInfoChanged, setIsInfoChanged] = useState(false);
   const [infoForm] = Form.useForm();
   const [passwordForm] = Form.useForm();
   const [changeUserInfo] = useChangeUserInfoMutation()
   const [changePassword] = useChangePasswordMutation();
   const dispatch = useAppDispatch();

   if (!currentUser) {
      return <Card>Please log in to view your profile</Card>;
   }

   const handleInfoEdit = () => {
      infoForm.setFieldsValue({
         fullName: currentUser.fullName,
         userName: currentUser.userName,
         email: currentUser.email,
      });
      setIsInfoModalOpen(true);
   };

   const handleInfoSave = async () => {
      try {
         const values = await infoForm.validateFields();
         const userUpdatedInfo = {
            id: currentUser.id,
            fullName: values.fullName,
            userName: values.userName,
            email: values.email,
            password: values.password
         }
         console.log(userUpdatedInfo);
         const res = await changeUserInfo(userUpdatedInfo).unwrap();

         setIsInfoModalOpen(false);
         toast.success('User info changed successfully');
      } catch (err) {
         toast.error('Password is incorrect');
      }
   };

   const handlePasswordEdit = () => {
      passwordForm.resetFields();
      setIsPasswordModalOpen(true);
   };

   const handlePasswordSave = async () => {
      try {
         const values = await passwordForm.validateFields();
         const userPassword = {
            id: currentUser.id,
            email: currentUser.email,
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
         }
         console.log(userPassword);
         const res = await changePassword(userPassword);
         dispatch(logout());
         navigate('/login');
         toast.success('Password changed successfully!!Login again');
         setIsPasswordModalOpen(false);
      } catch (err) {
         toast.error('Something wrong!try again...');
      }
   };

   return (
      <div className="space-y-6">
         <Card>
            <div className="flex flex-col md:flex-row gap-6">
               <Avatar
                  size={120}
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.userName}`}
                  className="flex-shrink-0"
               />
               <div className="flex-1 space-y-4">
                  <div>
                     <Title level={2} className="m-0">{currentUser?.fullName}</Title>
                     <Space size="small" className="mt-2">
                        <Mail size={16} />
                        <Text type="secondary">{currentUser?.email}</Text>
                     </Space>
                  </div>
                  <Space size="middle" wrap>
                     <Tag color="blue" icon={<Shield size={14} />}>
                        {currentUser?.role.toUpperCase()}
                     </Tag>
                     <Space size="small">
                        <Calendar size={16} className="text-muted-foreground" />
                        <Text type="secondary">
                           Joined {formatDistanceToNow(new Date(currentUser?.memberSince), { addSuffix: true })}
                        </Text>
                     </Space>
                  </Space>
               </div>
            </div>
         </Card>

         <Card title="Activity Statistics">
            <Row gutter={16}>
               <Col xs={24} sm={8}>
                  <Statistic title="Threads Created" value={0} valueStyle={{ color: 'hsl(var(--primary))' }} />
               </Col>
               <Col xs={24} sm={8}>
                  <Statistic title="Comments & Replies" value={0} valueStyle={{ color: 'hsl(var(--accent))' }} />
               </Col>
            </Row>
         </Card>

         <Card
            title="Account Details"
            extra={
               <Space>
                  <Button onClick={handleInfoEdit}>Edit Info</Button>
                  <Button type="primary" onClick={handlePasswordEdit}>
                     Change Password
                  </Button>
               </Space>
            }
         >
            <Descriptions column={1} bordered>
               <Descriptions.Item label="Full Name">{currentUser?.fullName}</Descriptions.Item>
               <Descriptions.Item label="Username">{currentUser?.userName}</Descriptions.Item>
               <Descriptions.Item label="Email">{currentUser?.email}</Descriptions.Item>
               <Descriptions.Item label="Role">{currentUser?.role}</Descriptions.Item>
               <Descriptions.Item label="Member Since">
                  {new Date(currentUser?.memberSince).toLocaleDateString()}
               </Descriptions.Item>
            </Descriptions>
         </Card>


         <Modal
            title="Edit General Information"
            open={isInfoModalOpen}
            onCancel={() => setIsInfoModalOpen(false)}
            footer={null}
         >
            <Form
               layout="vertical"
               form={infoForm}
               onFinish={handleInfoSave}
               initialValues={{
                  fullName: currentUser.fullName,
                  userName: currentUser.userName,
                  email: currentUser.email,
               }}
               onValuesChange={() => {
                  const hasChanges = Object.entries(infoForm.getFieldsValue())
                     .some(([key, value]) => value !== currentUser[key as keyof typeof currentUser]);
                  setIsInfoChanged(hasChanges);
               }}
            >
               <Form.Item
                  label="Full Name"
                  name="fullName"
                  rules={[{ required: true, message: 'Please enter your full name' }]}
               >
                  <Input placeholder="Enter full name" />
               </Form.Item>

               <Form.Item
                  label="Username"
                  name="userName"
                  rules={[{ required: true, message: 'Please enter your username' }]}
               >
                  <Input placeholder="Enter username" />
               </Form.Item>

               <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
               >
                  <Input placeholder="Enter email" />
               </Form.Item>

               <Form.Item
                  label="Enter Your Password"
                  name="password"
                  rules={[{ required: true, message: 'Please enter your password to confirm changes' }]}
               >
                  <Input.Password placeholder="Enter your password" />
               </Form.Item>

               <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={() => setIsInfoModalOpen(false)}>Cancel</Button>
                  <Button type="primary" htmlType="submit" disabled={!isInfoChanged}>
                     Save Changes
                  </Button>
               </div>
            </Form>
         </Modal>


         <Modal
            title="Change Password"
            open={isPasswordModalOpen}
            onCancel={() => setIsPasswordModalOpen(false)}
            footer={null}
         >
            <Form layout="vertical" form={passwordForm} onFinish={handlePasswordSave}>
               <Form.Item
                  label="Old Password"
                  name="oldPassword"
                  rules={[{ required: true, message: 'Please enter your old password' }]}
               >
                  <Input.Password placeholder="Enter old password" />
               </Form.Item>

               <Form.Item
                  label="New Password"
                  name="newPassword"
                  dependencies={['oldPassword']}
                  rules={[
                     ({ getFieldValue }) => ({
                        validator(_, value) {
                           const oldPassword = getFieldValue('oldPassword');
                           if (oldPassword && !value) {
                              return Promise.reject(new Error('Please enter your new password'));
                           }
                           if (value && value.length < 6) {
                              return Promise.reject(new Error('Password must be at least 6 characters'));
                           }
                           return Promise.resolve();
                        },
                     }),
                  ]}
               >
                  <Input.Password placeholder="Enter new password" />
               </Form.Item>

               <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={() => setIsPasswordModalOpen(false)}>Cancel</Button>
                  <Button type="primary" htmlType="submit">
                     Change Password
                  </Button>
               </div>
            </Form>
         </Modal>
      </div>
   );
};

export default Profile;
