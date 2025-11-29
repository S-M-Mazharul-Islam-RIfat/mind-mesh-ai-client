import { useEffect, useRef, useState } from "react";
import { useAddLikeInCommentMutation, useCreateCommentMutation, useGetAllCommentsByThreadIdQuery, useRemoveLikeFromCommentMutation } from "../../redux/features/comment/commentApi";
import type { RootState } from "../../redux/store";
import { useAppSelector } from "../../redux/hooks";
import { socket } from "../../utils/socket";
import { toast } from "sonner";
import { Card, Button, Space, Typography, Empty, Alert, Input, } from 'antd'
import CommentCard from "./CommentCard";
import { Send } from "lucide-react";
import CommonLoader from "../../shared/CommonLoader";
import type { TComment } from "../../types/comment.type";
const { Title } = Typography;
const { TextArea } = Input;

const CreateComment = ({ threadId }: { threadId: string }) => {
   const currentUser = useAppSelector((state: RootState) => state.auth.user);
   const { data: commentsData, refetch, isLoading } = useGetAllCommentsByThreadIdQuery(`${threadId}`);
   const comments = commentsData?.data;
   const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
   const [replyingTo, setReplyingTo] = useState<string | null>(null);
   const [replyingToAuthor, setReplyingToAuthor] = useState<string | null>(null);
   const [replyContent, setReplyContent] = useState('');
   const [createComment] = useCreateCommentMutation();
   const [addLikeInComment] = useAddLikeInCommentMutation();
   const [removeLikeFromComment] = useRemoveLikeFromCommentMutation();
   const replyBoxRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      if (!threadId) {
         return;
      }
      // sent request for joining the thread room
      socket.emit("join_thread", threadId);
      const handleNewComment = () => {
         // Clear previous timer
         if (debounceRef.current) {
            clearTimeout(debounceRef.current);
         }
         // Wait 500 ms before refetching
         debounceRef.current = setTimeout(() => {
            refetch();
         }, 500);
      };

      // listening and when a new comment will create it
      // will call the handleNewComment
      socket.on("new_comment_created", handleNewComment);

      return () => {
         socket.off("new_comment_created", handleNewComment);
         if (debounceRef.current) {
            clearTimeout(debounceRef.current);
         }
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
            commentBy: currentUser?.id,
         }
         toast.success('Commented', { id: toastId });
         await createComment(commentInfo).unwrap();
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

   const handleAddLike = async (commentId: string) => {
      const userId = currentUser?.id;
      await addLikeInComment({ commentId, userId });
      refetch();
   }

   const handleRemoveLike = async (commentId: string) => {
      const userId = currentUser?.id;
      await removeLikeFromComment({ commentId, userId });
      refetch();
   }

   if (isLoading) {
      return <CommonLoader></CommonLoader>
   }

   return (
      <div>
         <Title className='font-bold! py-3' level={4}>{commentsData?.meta?.commentsCount} Replies</Title>
         <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {comments?.length === 0 ? (
               <Empty description="No replies yet. Be the first to reply!" />
            ) : (
               <div className="space-y-4 pb-2">
                  {comments?.map((comment: TComment) => (
                     <CommentCard
                        key={comment._id}
                        comment={comment}
                        onReply={handleReply}
                        handleAddLike={handleAddLike}
                        handleRemoveLike={handleRemoveLike}
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
                              setReplyingTo(null);
                              setReplyingToAuthor(null);
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
                              setReplyingTo(null);
                              setReplyingToAuthor(null);
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
      </div>
   );
};

export default CreateComment;