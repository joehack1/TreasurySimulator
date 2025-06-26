export const FX_RATES: Record<string, number> = {
  KES_USD: 0.0067,
  USD_KES: 150,
  NGN_USD: 0.00125,
  USD_NGN: 800,
  KES_NGN: 5.33,
  NGN_KES: 0.19
};

export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): { convertedAmount: number; rate: number | null } => {
  if (fromCurrency === toCurrency) {
    return { convertedAmount: amount, rate: null };
  }

  const rateKey = `${fromCurrency}_${toCurrency}`;
  const rate = FX_RATES[rateKey];

  if (!rate) {
    throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
  }

  return {
    convertedAmount: amount * rate,
    rate
  };
};

export const getExchangeRate = (fromCurrency: string, toCurrency: string): number | null => {
  if (fromCurrency === toCurrency) return null;
  
  const rateKey = `${fromCurrency}_${toCurrency}`;
  return FX_RATES[rateKey] || null;
};
