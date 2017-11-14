import { parseDate } from './index';

export default function normalizeBanners(banners) {
  banners.forEach(banner => {
    banner.startDate = banner.startDate ? parseDate(banner.startDate) : undefined;
    banner.endDate = banner.endDate ? parseDate(banner.endDate) : undefined;
  });
}
