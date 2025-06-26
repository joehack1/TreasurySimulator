import { Card, CardContent } from "@/components/ui/card";
import { Account } from "@shared/schema";
import { formatCurrency, getCurrencyColor } from "@/lib/currency";
import { Wallet, DollarSign, CreditCard } from "lucide-react";

interface QuickStatsProps {
  accounts: Account[];
}

export default function QuickStats({ accounts }: QuickStatsProps) {
  const kesTotal = accounts
    .filter(acc => acc.currency === 'KES')
    .reduce((sum, acc) => sum + parseFloat(acc.balance), 0);

  const usdTotal = accounts
    .filter(acc => acc.currency === 'USD')
    .reduce((sum, acc) => sum + parseFloat(acc.balance), 0);

  const ngnTotal = accounts
    .filter(acc => acc.currency === 'NGN')
    .reduce((sum, acc) => sum + parseFloat(acc.balance), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="material-elevation-1 hover:material-elevation-2 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Wallet className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">KES Accounts</p>
              <p className={`text-2xl font-bold ${getCurrencyColor('KES')}`}>
                {formatCurrency(kesTotal, 'KES')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="material-elevation-1 hover:material-elevation-2 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">USD Accounts</p>
              <p className={`text-2xl font-bold ${getCurrencyColor('USD')}`}>
                {formatCurrency(usdTotal, 'USD')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="material-elevation-1 hover:material-elevation-2 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <CreditCard className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">NGN Accounts</p>
              <p className={`text-2xl font-bold ${getCurrencyColor('NGN')}`}>
                {formatCurrency(ngnTotal, 'NGN')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
