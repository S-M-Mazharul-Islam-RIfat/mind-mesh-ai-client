import { baseApi } from "../../api/baseApi";

const threadApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
      createThread: builder.mutation({
         query: (threadInfo) => ({
            url: '/threads/create-thread',
            method: 'POST',
            body: threadInfo
         }),
         invalidatesTags: ["Threads"]
      }),
      getAllThread: builder.query({
         query: ({ page, limit, search }) => ({
            url: `/threads?page=${page}&limit=${limit}&search=${search}`,
            method: 'GET',
         }),
         providesTags: ["Threads"],
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