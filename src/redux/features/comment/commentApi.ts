import { baseApi } from "../../api/baseApi";

const commentApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
      createComment: builder.mutation({
         query: (commentInfo) => ({
            url: '/comments/create-comment',
            method: 'POST',
            body: commentInfo
         })
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
