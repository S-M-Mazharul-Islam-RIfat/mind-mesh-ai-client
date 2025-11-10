import { useEffect, useState } from 'react';
import { Input, Card, Tag, Space, Typography, Empty, Spin, Button } from 'antd';
import { Search, Flag, ArrowUpCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetAllThreadQuery } from '../../redux/features/thread/threadApi';
import { formatDistanceToNow } from 'date-fns';
import InfiniteScroll from 'react-infinite-scroll-component';
const { Title, Text } = Typography;

const ThreadList = () => {
   const navigate = useNavigate();
   const [searchQuery, setSearchQuery] = useState('');
   const [activeSearch, setActiveSearch] = useState('');
   const [threads, setThreads] = useState<any[]>([]);
   const [page, setPage] = useState(1);
   const [showScrollTop, setShowScrollTop] = useState(false);
   const limit = 5;
   const { data, isLoading, isFetching } = useGetAllThreadQuery({ page, limit, search: activeSearch || '', });
   const total = data?.meta?.total || 0;
   const totalPages = data?.meta?.totalPages || 0;

   // add chunk by chunk threads data
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

   // smooth scroll to the top
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

   // Handle search click
   const handleSearch = () => {
      setPage(1);
      setThreads([]);
      setActiveSearch(searchQuery.trim());
   };

   // Handle search clear (reset)
   const handleClear = () => {
      setSearchQuery('');
      setActiveSearch('');
      setPage(1);
      setThreads([]);
   };

   return (
      <div className="space-y-6">
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
               <Title
                  level={2}
                  className="m-0 text-xl sm:text-2xl text-center sm:text-left"
               >
                  Discussion Threads
               </Title>
               <Tag
                  color="blue"
                  className="text-sm sm:text-base px-3 py-1 sm:py-2 rounded-full"
               >
                  {total || 0}
               </Tag>
            </div>
            <button
               onClick={() => navigate('/create-thread')}
               className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-medium 
         shadow-sm hover:bg-blue-700 transition-all duration-300 text-center cursor-pointer"
            >
               + Create Thread
            </button>
         </div>
         <div className="flex items-center gap-2">
            <Input
               size="large"
               placeholder="Search threads by title..."
               prefix={<Search size={20} />}
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
            />
            {!activeSearch && <Button
               type="primary"
               icon={<Search size={18} />}
               onClick={handleSearch}
               disabled={!searchQuery.trim()}
               size='large'
            >
               Search
            </Button>}
            {activeSearch && (
               <Button
                  icon={<XCircle size={18} />}
                  onClick={handleClear}
                  size='large'
               >
                  Clear
               </Button>
            )}
         </div>
         <InfiniteScroll
            dataLength={threads?.length}
            next={fetchMoreData}
            hasMore={page < totalPages}
            scrollThreshold={0.9}
            loader={
               (page < total) && (
                  <div className="flex justify-center py-4">
                     <Spin size="default" />
                  </div>
               )
            }
            endMessage={
               (page === totalPages) && (
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
                              {
                                 !isLoading && !isFetching && <Text type="secondary">
                                    {formatDistanceToNow(thread?.createdAt, { addSuffix: true })}
                                 </Text>
                              }
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
