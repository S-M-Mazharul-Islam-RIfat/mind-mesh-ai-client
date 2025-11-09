import { baseApi } from "../../api/baseApi";

const aiApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
      generateThreadSummary: builder.mutation({
         query: (threadBody) => ({
            url: `/ai/generate-thread-summary`,
            method: 'POST',
            body: threadBody
         }),
      }),
   })
})

export const { useGenerateThreadSummaryMutation } = aiApi;