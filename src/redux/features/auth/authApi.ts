import { baseApi } from "../../api/baseApi";

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
         })
      }),
      changeUserInfo: builder.mutation({
         query: (userInfo) => ({
            url: '/auth/change-user-info',
            method: 'PATCH',
            body: userInfo
         })
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