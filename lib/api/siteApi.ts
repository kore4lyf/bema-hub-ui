import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SiteDetails } from './types';
import { UpdateSettingsRequest } from './types';

export const siteApi = createApi({
  reducerPath: 'siteApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/wp-json/bmh/v1/`,
  }),
  endpoints: (builder) => ({
    getSiteDetails: builder.query<SiteDetails, void>({
      query: () => '/settings/general',
    }),
    updateSiteSettings: builder.mutation<SiteDetails, UpdateSettingsRequest>({
      query: (settings) => ({
        url: '/settings/general',
        method: 'PUT',
        body: settings,
      }),
    }),
  }),
});

export const { useGetSiteDetailsQuery, useUpdateSiteSettingsMutation } = siteApi;