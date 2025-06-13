
export const CURRENCY_CONFIG = {
  symbol: '€',
  code: 'EUR',
  locale: 'es-ES'
} as const;

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
    style: 'currency',
    currency: CURRENCY_CONFIG.code,
  }).format(amount);
};
