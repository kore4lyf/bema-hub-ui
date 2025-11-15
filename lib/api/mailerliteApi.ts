import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  MailerLiteSubscribeRequest,
  MailerLiteUnsubscribeRequest,
  MailerLiteAddToWebsiteGroupRequest,
  MailerLiteResponse
} from './types'

export const mailerliteApi = createApi({
  reducerPath: 'mailerliteApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/wp-json/bmh/v1/`,
  }),
  endpoints: (builder) => ({
    subscribeToNewsletter: builder.mutation<MailerLiteResponse, MailerLiteSubscribeRequest>({
      query: (data) => ({
        url: 'mailerlite/subscribe-newsletter',
        method: 'POST',
        body: data
      }),
    }),
    unsubscribeFromNewsletter: builder.mutation<MailerLiteResponse, MailerLiteUnsubscribeRequest>({
      query: (data) => ({
        url: 'mailerlite/unsubscribe-newsletter',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.token}`,
        },
      }),
    }),
    addUserToWebsiteGroup: builder.mutation<MailerLiteResponse, MailerLiteAddToWebsiteGroupRequest>({
      query: (data) => ({
        url: 'mailerlite/add-to-website-group',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${data.token}`,
        },
        body: data.userData,
      }),
    }),
  }),
})

export const {
  useSubscribeToNewsletterMutation,
  useUnsubscribeFromNewsletterMutation,
  useAddUserToWebsiteGroupMutation
} = mailerliteApi