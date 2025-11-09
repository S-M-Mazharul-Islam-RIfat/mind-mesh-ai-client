import { baseApi } from "../../api/baseApi";

const notificationApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
      getAllNotificationByUser: builder.query({
         query: (userId) => ({
            url: `/notifications/${userId}`,
            method: 'GET',
         }),
         providesTags: ["Notifications"],
      }),
   })
})

export const { useGetAllNotificationByUserQuery } = notificationApi;