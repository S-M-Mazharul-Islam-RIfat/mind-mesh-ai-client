import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Space, Tag, Avatar, Input, Empty, Alert } from 'antd';
import { ArrowLeft, Send, ThumbsUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast, Toaster } from 'sonner';
import { useGetSingleThreadQuery } from '../../redux/features/thread/threadApi';
import { useAppSelector } from '../../redux/hooks';
import type { RootState } from '../../redux/store';
import { useCreateCommentMutation, useGetAllCommentsByThreadIdQuery } from '../../redux/features/comment/commentApi';
import CommentCard from '../Comment/CommentCard';
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ThreadDetail = () => {
  const currentUser = useAppSelector((state: RootState) => state.auth.user);
  const { threadId } = useParams();
  const navigate = useNavigate();

  const { data: threadData } = useGetSingleThreadQuery(`${threadId}`);
  const thread = threadData?.data;
  const { data: commentsData, refetch } = useGetAllCommentsByThreadIdQuery(`${threadId}`);
  const comments = commentsData?.data;

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyingToAuthor, setReplyingToAuthor] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const [createComment] = useCreateCommentMutation();

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
          userName: currentUser?.userName,
          email: currentUser?.email
        }
      }
      toast.success('Commented', { id: toastId });
      <Toaster richColors position="top-center" />

      const res = await createComment(commentInfo).unwrap();
      console.log(res);
      refetch();
      setReplyingTo(null);
      setReplyingToAuthor(null);
      setReplyContent('');
    }
    catch {
      toast.error('Something went wrong', { id: toastId });
    }
  }

  // const threadCreatedAt = String(thread?.createdAt).substring(0, 10);

  const handleReply = (commentId: string, authorUserName: string) => {
    setReplyingTo(commentId);
    setReplyingToAuthor(authorUserName);
    console.log(replyingTo);
    console.log(authorUserName);
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
                <Text type="secondary">
                  {/* {formatDistanceToNow(threadCreatedAt, { addSuffix: true })} */}
                </Text>
              </div>
              <Paragraph>{thread?.threadBody}</Paragraph>
            </div>
          </div>

          <div className="flex gap-6 text-muted-foreground">
            <Text type="secondary">{thread?.commentsCount}</Text>
          </div>
        </Space>
      </Card>

      <Title level={4}>{commentsData?.commentsCount} Replies</Title>

      {comments?.length === 0 ? (
        <Empty description="No replies yet. Be the first to reply!" />
      ) : (
        <div className="space-y-4">
          {comments?.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              onReply={handleReply}
            />
          ))}
        </div>
      )}

      {
        currentUser && (
          <Card
            id="reply-box"
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
