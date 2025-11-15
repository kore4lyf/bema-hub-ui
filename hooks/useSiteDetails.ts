import { useGetSiteDetailsQuery, useUpdateSiteSettingsMutation } from '../lib/api/siteApi';
import { SiteDetails } from '@/lib/api/types';
import { UpdateSettingsRequest } from '../lib/api/types';

export const useSiteDetails = () => {
  const {
    data: siteDetails,
    isLoading,
    error,
    refetch
  } = useGetSiteDetailsQuery();

  const [updateSiteSettings, { isLoading: isUpdating, error: updateError }] = useUpdateSiteSettingsMutation();

  const updateSettings = async (settings: UpdateSettingsRequest) => {
    try {
      const result = await updateSiteSettings(settings).unwrap();
      // Refetch to get updated data
      refetch();
      return result;
    } catch (err) {
      console.error('Failed to update site settings:', err);
      throw err;
    }
  };

  return {
    siteDetails,
    isLoading,
    error,
    refetch,
    updateSettings,
    isUpdating,
    updateError,
    // Computed values
    hasLogo: Boolean(siteDetails?.logo),
    siteName: siteDetails?.title || 'Bema Hub',
    siteDescription: siteDetails?.tagline || '',
    siteUrl: siteDetails?.base_url || '',
    logoWidth: siteDetails?.logo_width || 100
  };
};