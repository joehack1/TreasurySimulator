export const getCurrencySymbol = (currency: string): string => {
  switch (currency) {
    case 'KES':
      return 'KES';
    case 'USD':
      return '$';
    case 'NGN':
      return '₦';
    default:
      return currency;
  }
};

export const getCurrencyFlag = (currency: string): string => {
  switch (currency) {
    case 'KES':
      return '🇰🇪';
    case 'USD':
      return '🇺🇸';
    case 'NGN':
      return '🇳🇬';
    default:
      return '🏳️';
  }
};

export const getCurrencyColor = (currency: string): string => {
  switch (currency) {
    case 'KES':
      return 'currency-kes';
    case 'USD':
      return 'currency-usd';
    case 'NGN':
      return 'currency-ngn';
    default:
      return 'text-gray-900';
  }
};

export const getCurrencyBorderColor = (currency: string): string => {
  switch (currency) {
    case 'KES':
      return 'border-kes';
    case 'USD':
      return 'border-usd';
    case 'NGN':
      return 'border-ngn';
    default:
      return 'border-gray-300';
  }
};

export const formatCurrency = (amount: string | number, currency: string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const symbol = getCurrencySymbol(currency);
  
  if (currency === 'USD') {
    return `${symbol}${numAmount.toLocaleString()}`;
  } else {
    return `${symbol} ${numAmount.toLocaleString()}`;
  }
};
