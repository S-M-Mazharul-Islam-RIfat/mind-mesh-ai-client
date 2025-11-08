import { useState } from 'react';
import { Card, Button, Space, Avatar, Typography } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import {
   ThumbsUp,
   Reply as ReplyIcon,
   CornerDownRight,
   ChevronDown,
} from 'lucide-react';

const { Text, Paragraph } = Typography;

const CommentCard = ({ comment, onReply, depth = 0 }: any) => {
   const [showReplies, setShowReplies] = useState(depth === 0);
   const [likes, setLikes] = useState(comment?.likes || 0);
   const [liked, setLiked] = useState(false);
   const nestedReplies = comment?.replies || [];

   const handleLike = () => {
      if (liked) {
         setLikes((prev) => prev - 1);
      } else {
         setLikes((prev) => prev + 1);
      }
      setLiked(!liked);
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
                        <Text type="secondary" className="text-sm">
                           {/* {formatDistanceToNow(comment?.createdAt, { addSuffix: true })} */}
                        </Text>
                     </Space>
                  </div>

                  <Paragraph className="mb-3">{comment?.commentBody}</Paragraph>

                  <Space>
                     <Button
                        type="text"
                        size="small"
                        icon={<ThumbsUp size={14} />}
                        onClick={handleLike}
                        className={`${liked ? 'text-blue-500' : ''}`}
                     >
                        {likes}
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
               {nestedReplies.map((reply) => (
                  <CommentCard
                     key={reply._id}
                     comment={reply}
                     onReply={onReply}
                     depth={depth + 1}
                  />
               ))}
            </div>
         )}
      </div>
   );
};

export default CommentCard;
