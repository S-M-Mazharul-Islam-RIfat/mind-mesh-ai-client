import { verifyToken } from "../../../utils/verifyToken";
import { baseApi } from "../../api/baseApi";
import { setUser, type TUser } from "./authSlice";

const authApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
      signup: builder.mutation({
         query: (userInfo) => ({
            url: '/auth/signup',
            method: 'POST',
            body: userInfo
         })
      }),
      login: builder.mutation({
         query: (userInfo) => ({
            url: '/auth/login',
            method: 'POST',
            body: userInfo
         }),
         invalidatesTags: ["Threads", "Comments", "Notifications"],
      }),
      changeUserInfo: builder.mutation({
         query: (userInfo) => ({
            url: '/auth/change-user-info',
            method: 'PATCH',
            body: userInfo
         }),
         async onQueryStarted(arg, { dispatch, queryFulfilled }) {
            try {
               const { data } = await queryFulfilled;
               const user = verifyToken(data.accessToken) as TUser;
               dispatch(setUser({ user: user, token: data.accessToken }));
            } catch (err) {
               console.error(err);
            }
         }
      }),
      changePassword: builder.mutation({
         query: (userPassword) => ({
            url: '/auth/change-password',
            method: 'PATCH',
            body: userPassword
         })
      }),
   })
})

export const { useSignupMutation, useLoginMutation, useChangeUserInfoMutation, useChangePasswordMutation } = authApi;