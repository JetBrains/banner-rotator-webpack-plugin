import { parseDate } from './index';

/**
 * @param {Array<Banner>} banners
 * @return {Array<Banner>}
 */
export default function normalizeBanners(banners) {
  banners.forEach(banner => {
    const { startDate, endDate } = banner;

    if (startDate) {
      banner.startDate = parseDate(startDate);
    }

    if (endDate) {
      banner.endDate = parseDate(endDate);
    }
  });

  return banners;
}
