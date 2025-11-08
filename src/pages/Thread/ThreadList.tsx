import { useEffect, useState } from 'react';
import { Input, Card, Tag, Space, Typography, Empty, Spin } from 'antd';
import { Search, Flag, ArrowUpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetAllThreadQuery } from '../../redux/features/thread/threadApi';
import { formatDistanceToNow } from 'date-fns';
import InfiniteScroll from 'react-infinite-scroll-component';

const { Title, Text } = Typography;

const ThreadList = () => {
   const navigate = useNavigate();
   const [searchQuery, setSearchQuery] = useState('');
   const [threads, setThreads] = useState<any[]>([]);
   const [page, setPage] = useState(1);
   const [showScrollTop, setShowScrollTop] = useState(false);
   const limit = 5;
   const { data, isFetching } = useGetAllThreadQuery({ page, limit });
   const totalPages = data?.meta?.totalPages || 1;
   const totalSegment = Math.ceil(totalPages / limit);


   useEffect(() => {
      if (data?.data) {
         setThreads((prev) => [...prev, ...data.data]);
      }
   }, [data]);

   const fetchMoreData = () => {
      if (totalPages && page < totalPages) {
         setPage((prev) => prev + 1);
      }
   };

   useEffect(() => {
      const handleScroll = () => {
         if (window.scrollY > 400) setShowScrollTop(true);
         else setShowScrollTop(false);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
   };

   return (
      <div className="space-y-6">
         <div className="flex items-center gap-1">
            <Title level={2} className="m-0">
               Discussion Threads
            </Title>
            <Tag color="blue" className="text-base px-3 py-5 rounded-full">
               {totalPages || 0}
            </Tag>
         </div>

         <Input
            size="large"
            placeholder="Search threads by title, content, or tags..."
            prefix={<Search size={18} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
         />


         <InfiniteScroll
            dataLength={threads.length}
            next={fetchMoreData}
            hasMore={page < totalSegment}
            scrollThreshold={0.9}
            loader={
               (page < totalPages) && (
                  <div className="flex justify-center py-4">
                     <Spin size="default" />
                  </div>
               )
            }
            endMessage={
               (page === totalSegment) && (
                  <div className="flex justify-center items-center gap-2 py-4">
                     <Flag size={20} className="text-blue-500" />
                     <Text type="secondary">You have reached the end.</Text>
                  </div>
               )
            }
            scrollableTarget="scrollableDiv"
            style={{ overflow: 'visible' }}
         >
            <div className="flex flex-col gap-5">
               {threads.length === 0 && !isFetching ? (
                  <Empty description="No threads found" />
               ) : (
                  threads.map((thread) => (
                     <Card
                        key={thread._id}
                        hoverable
                        onClick={() => navigate(`/thread/${thread._id}`)}
                        className="cursor-pointer transition-all hover:shadow-md space-y-4"
                     >
                        <div className="space-y-3">
                           <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                 <Title level={4} className="m-0 hover:text-primary transition-colors">
                                    {thread.title}
                                 </Title>
                                 <Text type="secondary" className="block mt-2 line-clamp-2">
                                    {thread.threadBody}
                                 </Text>
                              </div>
                           </div>

                           <div className="flex items-center justify-between flex-wrap gap-3">
                              <Space size="small" wrap>
                                 {(thread.tags || []).map((tag: string) => (
                                    <Tag color="blue" key={tag}>{tag}</Tag>
                                 ))}
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
         </InfiniteScroll>

         {showScrollTop && (
            <button
               onClick={scrollToTop}
               className="fixed bottom-6 right-6 bg-white text-blue-600 p-3 rounded-full shadow-lg 
              hover:scale-110 transition-all duration-300 hover:shadow-blue-400/60 cursor-pointer"
               style={{
                  animation: 'float 3s ease-in-out infinite',
               }}
            >
               <ArrowUpCircle
                  size={28}
                  className="drop-shadow-md animate-blink-smooth transition-colors duration-300 hover:text-blue-700"
               />
            </button>
         )}
      </div>
   );
};

export default ThreadList;
