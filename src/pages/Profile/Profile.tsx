import { Card, Typography, Avatar, Space, Tag, Descriptions, Statistic, Row, Col } from 'antd';
import { Mail, Calendar, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

const { Title, Text } = Typography;

const Profile = () => {
   const currentUser = useSelector((state: RootState) => state.auth.user);

   if (!currentUser) {
      return (
         <Card>Please log in to view your profile</Card>
      );
   }

   const userThreads = 0;
   const userPosts = 0;

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
                           {/* Joined {formatDistanceToNow(currentUser?.createdAt, { addSuffix: true })} */}
                        </Text>
                     </Space>
                  </Space>
               </div>
            </div>
         </Card>

         <Card title="Activity Statistics">
            <Row gutter={16}>
               <Col xs={24} sm={8}>
                  <Statistic
                     title="Threads Created"
                     value={0}
                     valueStyle={{ color: 'hsl(var(--primary))' }}
                  />
               </Col>
               <Col xs={24} sm={8}>
                  <Statistic
                     title="Comments & Replies"
                     value={0}
                     valueStyle={{ color: 'hsl(var(--accent))' }}
                  />
               </Col>
            </Row>
         </Card>

         <Card title="Account Details">
            <Descriptions column={1} bordered>
               <Descriptions.Item label="Full Name">{currentUser?.fullName}</Descriptions.Item>
               <Descriptions.Item label="Username">{currentUser?.userName}</Descriptions.Item>
               <Descriptions.Item label="Email">{currentUser?.email}</Descriptions.Item>
               <Descriptions.Item label="Role">{currentUser?.role}</Descriptions.Item>
               <Descriptions.Item label="Member Since">
                  {currentUser?.memberSince}
               </Descriptions.Item>
            </Descriptions>
         </Card>

         {/* <Card title="Recent Activity">
            <Space direction="vertical" size="middle" className="w-full">
               {userThreads.length === 0 && userPosts.length === 0 ? (
                  <Text type="secondary">No activity yet</Text>
               ) : (
                  <>
                     {userThreads.slice(0, 5).map(thread => (
                        <div key={thread.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                           <Text strong>{thread.title}</Text>
                           <br />
                           <Text type="secondary" className="text-sm">
                              Thread • {formatDistanceToNow(thread.createdAt, { addSuffix: true })}
                           </Text>
                        </div>
                     ))}
                     {userPosts.slice(0, 5).map(post => (
                        <div key={post.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                           <Text>{post.content.substring(0, 100)}...</Text>
                           <br />
                           <Text type="secondary" className="text-sm">
                              Reply • {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                           </Text>
                        </div>
                     ))}
                  </>
               )}
            </Space>
         </Card> */}
      </div>
   );
};

export default Profile;
