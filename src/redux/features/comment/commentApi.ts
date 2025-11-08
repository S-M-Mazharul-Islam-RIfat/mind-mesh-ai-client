import { toast } from "sonner";
import { socket } from "../../../utils/socket";
import { baseApi } from "../../api/baseApi";

const commentApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
      createComment: builder.mutation({
         query: (commentInfo) => ({
            url: '/comments/create-comment',
            method: 'POST',
            body: commentInfo
         }),
         async onQueryStarted(arg, { queryFulfilled }) {
            try {
               const { data } = await queryFulfilled;
               const newComment = data?.data;

               socket.emit("new_comment_created", {
                  threadId: newComment.threadId,
                  comment: newComment,
               });

               toast.success("Comment posted!");
            } catch (err) {
               toast.error("Failed to post comment");
            }
         }
      }),
      getAllCommentsByThreadId: builder.query({
         query: (threadId) => ({
            url: `/comments/${threadId}`,
            method: 'GET',
         })
      }),
   })
})

export const { useCreateCommentMutation, useGetAllCommentsByThreadIdQuery } = commentApi;
