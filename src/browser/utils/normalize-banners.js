import { parseDate } from './index';

/**
 * @param {Array<Banner>} banners
 * @return {Array<Banner>}
 */
export default function normalizeBanners(banners) {
  banners.forEach(banner => {
    banner.start = banner.start ? parseDate(banner.start) : undefined;
    banner.end = banner.end ? parseDate(banner.end) : undefined;
  });

  return banners;
}
