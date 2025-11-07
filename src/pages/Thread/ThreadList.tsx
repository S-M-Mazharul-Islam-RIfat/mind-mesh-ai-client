import { useEffect, useState } from 'react';
import { Input, Card, Tag, Space, Typography, Button, Empty } from 'antd';
import { Search, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetAllThreadQuery } from '../../redux/features/thread/threadApi';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const { Title, Text } = Typography;

const ThreadList = () => {
   const navigate = useNavigate();
   const [searchQuery, setSearchQuery] = useState('');
   const { data: threads, refetch } = useGetAllThreadQuery(undefined);

   useEffect(() => {
      refetch();
   }, [refetch]);

   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <Title level={2} className="m-0">Discussion Threads</Title>
            <Button
               type="primary"
               size="large"
               onClick={() => navigate('/create-thread')}
            >
               Create Thread
            </Button>
         </div>

         <Input
            size="large"
            placeholder="Search threads by title, content, or tags..."
            prefix={<Search size={18} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
         />

         <div className="flex flex-col gap-5">
            {threads?.data.length === 0 ? (
               <Empty description="No threads found" />
            ) : (
               threads?.data.map(thread => (
                  <Card
                     key={thread._id}
                     hoverable
                     onClick={() => navigate(`/thread/${thread._id}`)}
                     className="cursor-pointer transition-all hover:shadow-md space-y-4"
                  >
                     <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                           <div className="flex-1">
                              <Space size="small">
                                 <Title
                                    level={4}
                                    className="m-0 inline-block hover:text-primary transition-colors"
                                 >
                                    {thread.title}
                                 </Title>
                              </Space>
                              <Text type="secondary" className="block mt-2 line-clamp-2">
                                 {thread.threadBody}
                              </Text>
                           </div>
                        </div>

                        <div className="flex items-center justify-between flex-wrap gap-3">
                           <Space size="small" wrap>
                              <Tag color="blue">Golang</Tag>
                              <Tag color="blue">Backend Dev</Tag>
                              <Tag color="blue">Devops</Tag>
                           </Space>

                           <Space size="large" className="text-muted-foreground">
                              <Space size="small">
                                 <MessageSquare size={16} />
                                 <Text type="secondary">{0}</Text>
                              </Space>
                           </Space>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                           <Text type="secondary" strong>
                              by {thread.author.userName}
                           </Text>
                           <Text type="secondary">
                              {formatDistanceToNow(thread.updatedAt, { addSuffix: true })}
                           </Text>
                        </div>
                     </div>
                  </Card>
               ))
            )}
         </div>
      </div>
   );
};

export default ThreadList;
