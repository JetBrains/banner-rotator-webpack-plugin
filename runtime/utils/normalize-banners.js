import { parseDate } from './index';

/**
 * @param {Array<BannerConfig>} banners
 * @return {Array<BannerConfig>}
 */
export default function normalizeBanners(banners) {
  banners.forEach(banner => {
    banner.startDate = banner.startDate ? parseDate(banner.startDate) : undefined;
    banner.endDate = banner.endDate ? parseDate(banner.endDate) : undefined;
  });

  return banners;
}
