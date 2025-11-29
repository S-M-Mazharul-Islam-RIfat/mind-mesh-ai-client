import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Space, Tag, Avatar, Spin } from 'antd';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useGetSingleThreadQuery } from '../../redux/features/thread/threadApi';
import { useGenerateThreadSummaryMutation } from '../../redux/features/ai/aiApi';
import CreateComment from '../Comment/CreateComment';
import CommonLoader from '../../shared/CommonLoader';
import { formatDistanceToNow } from 'date-fns';
const { Title, Text, Paragraph } = Typography;

const ThreadDetail = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { data: threadData, isLoading, isFetching } = useGetSingleThreadQuery(`${threadId}`);
  const thread = threadData?.data;
  const [loading, setLoading] = useState(false);
  const [threadSummary, setThreadSummary] = useState("");
  const [genearateThreadSummary] = useGenerateThreadSummaryMutation();

  const handleGenerateSummary = async () => {
    setLoading(true);
    const res = await genearateThreadSummary({ threadBody: thread?.threadBody }).unwrap();
    setLoading(false);
    setThreadSummary(res.data);
  };

  if (isLoading) {
    return <CommonLoader></CommonLoader>
  }

  return (
    <div className="space-y-6">
      <Button
        icon={<ArrowLeft size={18} />}
        onClick={() => navigate('/')}
      >
        Back to Threads
      </Button>
      <Card>
        <Space direction="vertical" size="middle" className="w-full">
          <div>
            <Title level={2} className="m-0 mb-2">{thread?.title}</Title>
            <Space wrap>
              {thread.tags.map((tag: string) => (
                <Tag color="blue">{tag}</Tag>
              ))}
            </Space>
          </div>
          <div className="flex gap-4">
            <Avatar
              size="large"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${thread?.author.userName}`}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Text strong>{thread?.author.userName}</Text>
                <Text type="secondary">•</Text>
                {
                  !isLoading && !isFetching && <Text type="secondary">
                    {formatDistanceToNow(thread?.createdAt, { addSuffix: true })}
                  </Text>
                }
              </div>
              <Paragraph>{thread?.threadBody}</Paragraph>
            </div>
          </div>
          <div className="flex gap-6 text-muted-foreground">
            <Text type="secondary">{thread?.commentsCount}</Text>
          </div>
        </Space>
        <div className="flex flex-col gap-3">
          <Button
            type="primary"
            icon={<Sparkles size={16} />}
            onClick={handleGenerateSummary}
            disabled={loading}
            size="small"
            className="w-auto sm:w-[40%] md:w-[25%] lg:w-[12%] min-w-fit px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md flex items-center justify-center gap-2 transition-all duration-200 ease-in-out">
            {loading ? "Generating..." : "Generate Thread Summary"}
          </Button>
          {loading && <Spin tip="Generating summary..." />}
          {threadSummary.length > 0 && !loading && <Card
            className="mt-2 bg-[#1e293b] border border-gray-600"
            size="small"
          >
            <div className="mb-1">
              <Text className="text-gray-400 text-sm font-semibold tracking-wide">
                Summary
              </Text>
            </div>
            <Text className="text-gray-200">{threadSummary}</Text>
          </Card>}
        </div>
      </Card>
      <CreateComment threadId={threadId!}></CreateComment>
    </div >
  );
};

export default ThreadDetail;
