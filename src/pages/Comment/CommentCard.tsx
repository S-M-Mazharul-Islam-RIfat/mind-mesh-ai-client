import { useState } from 'react';
import { Card, Button, Space, Avatar, Typography } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import {
   Reply as ReplyIcon,
   CornerDownRight,
   ChevronDown,
   ThumbsUp,
} from 'lucide-react';
import type { TComment } from '../../types/comment.type';
import { useAppSelector } from '../../redux/hooks';
import type { RootState } from '../../redux/store';
const { Text, Paragraph } = Typography;

const CommentCard = ({ comment, onReply, handleAddLike, handleRemoveLike, depth = 0 }: { comment: TComment, onReply: (commentId: string, authorUserName: string) => void, handleAddLike: (commentId: string) => void, handleRemoveLike: (commentId: string) => void, depth?: number }) => {
   const currentUser = useAppSelector((state: RootState) => state.auth.user);
   const [showReplies, setShowReplies] = useState(depth === 0);
   const nestedReplies = comment?.replies || [];

   const targetId = currentUser?.id.toString();
   const liked = comment?.likedBy.some((id: string) => id.toString() === targetId);

   const handleLike = () => {
      if (liked) {
         handleRemoveLike(comment?._id)
      } else {
         handleAddLike(comment?._id);
      }
   };

   return (
      <div className={`${depth > 0 ? 'ml-8 mt-4' : 'mb-4'} animate-fade-in`}>
         <Card
            className="p-0 relative transition-all duration-300 hover:shadow-lg hover-scale"
            style={{
               borderLeft: depth > 0 ? '3px solid hsl(var(--primary))' : undefined,
               backgroundColor: depth > 0 ? '#B5DFC5' : undefined,
            }}
         >
            {depth > 0 && (
               <div className="absolute -left-8 top-6 text-muted-foreground">
                  <CornerDownRight size={20} />
               </div>
            )}
            <div className="flex gap-4">
               <Avatar
                  size={depth > 0 ? 'default' : 'large'}
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment?.commentBy?.userName}`}
               />
               <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                     <Space>
                        <Text strong>{comment?.commentBy?.userName}</Text>
                        {
                           comment && <Text type="secondary" className="text-sm">
                              {formatDistanceToNow(comment?.createdAt, { addSuffix: true })}
                           </Text>
                        }
                     </Space>
                  </div>
                  <Paragraph className="mb-3">{comment?.commentBody}</Paragraph>
                  <Space>
                     <Button
                        type="text"
                        size="small"
                        icon={<ThumbsUp size={14} />}
                        onClick={handleLike}
                        className={`${liked ? 'text-blue-500!' : ''}`}
                     >
                        {comment?.likes}
                     </Button>
                     <Button
                        type="text"
                        size="small"
                        icon={<ReplyIcon size={14} />}
                        onClick={() =>
                           onReply(comment?._id, comment?.commentBy?.userName)
                        }
                     >
                        Reply
                     </Button>
                     {nestedReplies.length > 0 && (
                        <Button
                           type="text"
                           size="small"
                           icon={
                              <div
                                 className={`transition-transform duration-300 ease-in-out ${showReplies ? 'rotate-0' : '-rotate-90'
                                    }`}
                              >
                                 <ChevronDown size={14} />
                              </div>
                           }
                           onClick={() => setShowReplies((prev) => !prev)}
                        >
                           {showReplies
                              ? `Hide ${nestedReplies.length} repl${nestedReplies.length > 1 ? 'ies' : 'y'
                              }`
                              : `Show ${nestedReplies.length} repl${nestedReplies.length > 1 ? 'ies' : 'y'
                              }`}
                        </Button>
                     )}
                  </Space>
               </div>
            </div>
         </Card>
         {nestedReplies.length > 0 && (
            <div
               className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out ${showReplies ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
            >
               {nestedReplies.length >= 1 && nestedReplies.map((reply) => (
                  <CommentCard
                     key={reply._id}
                     comment={reply}
                     onReply={onReply}
                     handleAddLike={handleAddLike}
                     handleRemoveLike={handleRemoveLike}
                     depth={depth + 1}
                  />
               ))}
            </div>
         )}
      </div>
   );
};

export default CommentCard;
