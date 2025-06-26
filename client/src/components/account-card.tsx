import { Card, CardContent } from "@/components/ui/card";
import { Account } from "@shared/schema";
import { formatCurrency, getCurrencyFlag, getCurrencyColor, getCurrencyBorderColor } from "@/lib/currency";
import { convertCurrency } from "@/lib/fx-rates";
import { Smartphone, Building2, Wallet } from "lucide-react";

interface AccountCardProps {
  account: Account;
}

export default function AccountCard({ account }: AccountCardProps) {
  const getAccountIcon = (accountType: string) => {
    switch (accountType) {
      case 'mobile_money':
        return <Smartphone className="h-5 w-5" />;
      case 'bank':
        return <Building2 className="h-5 w-5" />;
      case 'digital_wallet':
        return <Wallet className="h-5 w-5" />;
      default:
        return <Building2 className="h-5 w-5" />;
    }
  };

  const getAccountTypeLabel = (accountType: string) => {
    switch (accountType) {
      case 'mobile_money':
        return 'Mobile Money';
      case 'bank':
        return 'Bank';
      case 'digital_wallet':
        return 'Digital Wallet';
      default:
        return 'Account';
    }
  };

  const getUsdEquivalent = () => {
    if (account.currency === 'USD') return null;
    
    try {
      const { convertedAmount } = convertCurrency(
        parseFloat(account.balance),
        account.currency,
        'USD'
      );
      return `≈ ${formatCurrency(convertedAmount, 'USD')}`;
    } catch {
      return null;
    }
  };

  return (
    <Card className={`border-l-4 ${getCurrencyBorderColor(account.currency)} bg-white material-elevation-1 hover:material-elevation-2 transition-all duration-300 animate-slide-in hover-lift hover-glow cursor-pointer`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-gray-900 hover-slide transition-all duration-200">{account.name}</h3>
            <div className="flex items-center mt-1">
              <span className="text-2xl mr-2 hover-bounce">{getCurrencyFlag(account.currency)}</span>
              <span className="text-sm text-gray-600 hover-slide transition-all duration-200">{getAccountTypeLabel(account.accountType)}</span>
            </div>
          </div>
          <div className={`${getCurrencyColor(account.currency)} hover-rotate transition-all duration-300`}>
            {getAccountIcon(account.accountType)}
          </div>
        </div>
        <div className="mt-3">
          <p className={`text-2xl font-bold ${getCurrencyColor(account.currency)} animate-count-up hover-scale transition-all duration-200`}>
            {formatCurrency(account.balance, account.currency)}
          </p>
          {getUsdEquivalent() && (
            <p className="text-xs text-gray-500 mt-1 hover-slide transition-all duration-200">{getUsdEquivalent()}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
