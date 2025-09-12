export type ChannelAnalytics = {
  channel: string;
  clicks: number;
  conversions: number;
  conversion_rate: number;
};

export const mockChannelAnalytics: ChannelAnalytics[] = [
  { channel: 'telegram', clicks: 150, conversions: 12, conversion_rate: 8.0 },
  { channel: 'whatsapp', clicks: 200, conversions: 18, conversion_rate: 9.0 },
  { channel: 'email', clicks: 80, conversions: 6, conversion_rate: 7.5 },
];

export const mockActivities = [
  { id: 1, type: 'click', channel: 'Telegram', time: '2 минуты назад' },
  { id: 2, type: 'lead', message: 'Новая заявка от клиента', time: '15 минут назад' },
  { id: 3, type: 'conversion', channel: 'WhatsApp', time: '1 час назад' },
];

export const getTotals = (data: ChannelAnalytics[]) => {
  const totalClicks = data.reduce((sum, ch) => sum + ch.clicks, 0);
  const totalConversions = data.reduce((sum, ch) => sum + ch.conversions, 0);
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
  return { totalClicks, totalConversions, conversionRate };
};

