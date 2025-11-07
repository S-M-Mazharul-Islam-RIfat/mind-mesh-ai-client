import { baseApi } from "../../api/baseApi";

const threadApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
      createThread: builder.mutation({
         query: (threadInfo) => ({
            url: '/threads/create-thread',
            method: 'POST',
            body: threadInfo
         })
      }),
      getAllThread: builder.query({
         query: () => ({
            url: '/threads',
            method: 'GET',
         })
      }),
      getSingleThread: builder.query({
         query: (id) => ({
            url: `/threads/thread/${id}`,
            method: 'GET',
         })
      })
   })
})

export const { useCreateThreadMutation, useGetAllThreadQuery, useGetSingleThreadQuery } = threadApi;