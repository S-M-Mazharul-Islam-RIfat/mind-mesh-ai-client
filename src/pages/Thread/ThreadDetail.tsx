import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Space, Tag, Avatar, Input, Empty, Alert, Spin } from 'antd';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast, Toaster } from 'sonner';
import { useGetSingleThreadQuery } from '../../redux/features/thread/threadApi';
import { useAppSelector } from '../../redux/hooks';
import type { RootState } from '../../redux/store';
import { useCreateCommentMutation, useGetAllCommentsByThreadIdQuery } from '../../redux/features/comment/commentApi';
import CommentCard from '../Comment/CommentCard';
import { socket } from '../../utils/socket';
import { useGenerateThreadSummaryMutation } from '../../redux/features/ai/aiApi';
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ThreadDetail = () => {
  const currentUser = useAppSelector((state: RootState) => state.auth.user);
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { data: threadData } = useGetSingleThreadQuery(`${threadId}`);
  const thread = threadData?.data;
  const { data: commentsData, refetch, isLoading, isFetching } = useGetAllCommentsByThreadIdQuery(`${threadId}`);
  const comments = commentsData?.data;
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyingToAuthor, setReplyingToAuthor] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [createComment] = useCreateCommentMutation();
  const replyBoxRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [threadSummary, setThreadSummary] = useState("");
  const [genearateThreadSummary] = useGenerateThreadSummaryMutation();


  useEffect(() => {
    if (!threadId) {
      return;
    }
    socket.emit("join_thread", threadId);
    const handleNewComment = (comment: any) => {
      // Clear previous timer
      if (debounceRef.current) clearTimeout(debounceRef.current);
      // Wait 1s before refetching
      debounceRef.current = setTimeout(() => {
        refetch();
      }, 500);
    };

    socket.on("new_comment_created", handleNewComment);

    return () => {
      socket.off("new_comment_created", handleNewComment);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [threadId, refetch]);


  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !threadId) {
      toast.warning('Please enter a reply');
      return;
    }
    const toastId = toast.loading('Commenting...');
    try {
      const commentInfo = {
        threadId,
        parentId: replyingTo,
        commentBody: replyContent,
        commentBy: {
          id: currentUser?.id,
          userName: currentUser?.userName,
          email: currentUser?.email
        }
      }
      toast.success('Commented', { id: toastId });
      <Toaster richColors position="top-center" />

      const res = await createComment(commentInfo).unwrap();
      refetch();
      setReplyingTo(null);
      setReplyingToAuthor(null);
      setReplyContent('');
    }
    catch {
      toast.error('Something went wrong', { id: toastId });
    }
  }

  const handleReply = (commentId: string, authorUserName: string) => {
    setReplyingTo(commentId);
    setReplyingToAuthor(authorUserName);
    // Smooth scroll to reply box
    setTimeout(() => {
      replyBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleGenerateSummary = async () => {
    setLoading(true);
    const res = await genearateThreadSummary({ threadBody: thread?.threadBody }).unwrap();
    setLoading(false);
    setThreadSummary(res.data);
  };

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
              {thread?.tags.map((tag) => (
                <Tag key={tag} color="blue">{tag}</Tag>
              ))}
            </Space>
          </div>

          <div className="flex gap-4">
            <Avatar
              size="large"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=mj_riffu`}
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
            className="w-auto sm:w-[40%] md:w-[25%] lg:w-[12%]
          min-w-fit px-3 py-2
    bg-purple-600 hover:bg-purple-700 text-white font-medium
    rounded-md flex items-center justify-center gap-2
    transition-all duration-200 ease-in-out
  "
          >
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
      <Title className='!font-bold py-3' level={4}>{commentsData?.meta?.commentsCount} Replies</Title>
      <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {comments?.length === 0 ? (
          <Empty description="No replies yet. Be the first to reply!" />
        ) : (
          <div className="space-y-4 pb-2">
            {comments?.map((comment) => (
              <CommentCard
                key={comment._id}
                comment={comment}
                onReply={handleReply}
              />
            ))}
          </div>
        )}
      </div>
      {
        currentUser && (
          <Card
            id="reply-box"
            ref={replyBoxRef}
            title={replyingTo ? "Post a Nested Reply" : "Add a Reply"}
          >
            <Space direction="vertical" size="middle" className="w-full">
              {replyingTo && replyingToAuthor && (
                <Alert
                  message={`Replying to ${replyingToAuthor}'s comment`}
                  type="info"
                  closable
                  onClose={() => {
                    setReplyingTo(undefined);
                    setReplyingToAuthor(undefined);
                  }}
                  showIcon
                />
              )}
              <TextArea
                rows={4}
                placeholder={replyingTo ? `Reply to ${replyingToAuthor}...` : "Write your reply..."}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                {replyingTo && (
                  <Button onClick={() => {
                    setReplyingTo(undefined);
                    setReplyingToAuthor(undefined);
                  }}>
                    Cancel Nested Reply
                  </Button>
                )}
                <Button
                  type="primary"
                  icon={<Send size={16} />}
                  onClick={handleSubmitReply}
                >
                  {replyingTo ? 'Post Nested Reply' : 'Post Reply'}
                </Button>
              </div>
            </Space>
          </Card>
        )
      }
    </div >
  );
};

export default ThreadDetail;
