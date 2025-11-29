import { baseApi } from "../../api/baseApi";

const notificationApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
      getAllNotificationByUser: builder.query({
         query: ({ userId, page, limit }) => ({
            url: `/notifications/?userId=${userId}&page=${page}&limit=${limit}`,
            method: 'GET',
         }),
         providesTags: ["Notifications"],
      }),
   })
})

export const { useGetAllNotificationByUserQuery } = notificationApi;