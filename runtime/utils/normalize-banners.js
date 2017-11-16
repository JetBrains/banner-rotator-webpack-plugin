import { parseDate } from './index';

/**
 * @param {Array<BannerConfig>} banners
 * @return {Array<BannerConfig>}
 */
export default function normalizeBanners(banners) {
  banners.forEach(banner => {
    banner.start = banner.start ? parseDate(banner.start) : undefined;
    banner.end = banner.end ? parseDate(banner.end) : undefined;
  });

  return banners;
}
