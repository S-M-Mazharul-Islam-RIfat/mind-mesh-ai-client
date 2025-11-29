import { toast } from "sonner";
import { socket } from "../../../utils/socket";
import { baseApi } from "../../api/baseApi";

const commentApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
      createComment: builder.mutation({
         query: (commentInfo) => ({
            url: '/comments/create-comment',
            method: 'POST',
            body: commentInfo,
         }),
         invalidatesTags: ["Comments", "Notifications"],
         async onQueryStarted(arg, { queryFulfilled }) {
            try {
               const { data } = await queryFulfilled;
               const newComment = data?.data;
               socket.emit("new_comment_created", {
                  threadId: newComment.threadId,
                  comment: newComment,
               });
            } catch {
               toast.error("Failed to post comment");
            }
         }
      }),
      getAllCommentsByThreadId: builder.query({
         query: (threadId) => ({
            url: `/comments/${threadId}`,
            method: 'GET',
         }),
         providesTags: ["Comments"],
      }),
      addLikeInComment: builder.mutation({
         query: (info) => ({
            url: `/comments/${info.commentId}/add-like`,
            method: 'PATCH',
            body: { userId: info.userId }
         }),
      }),
      removeLikeFromComment: builder.mutation({
         query: (info) => ({
            url: `/comments/${info.commentId}/remove-like`,
            method: 'PATCH',
            body: { userId: info.userId }
         }),
      })
   })
})

export const { useCreateCommentMutation, useGetAllCommentsByThreadIdQuery, useAddLikeInCommentMutation, useRemoveLikeFromCommentMutation } = commentApi;
