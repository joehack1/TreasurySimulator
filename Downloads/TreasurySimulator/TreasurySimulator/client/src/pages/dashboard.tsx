import { useQuery } from "@tanstack/react-query";
import { Account } from "@shared/schema";
import FloatingBackground from "@/components/floating-background";
import QuickStats from "@/components/quick-stats";
import AccountCard from "@/components/account-card";
import TransferForm from "@/components/transfer-form";
import TransactionLog from "@/components/transaction-log";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Building2, TrendingUp, Bell } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const [showAllAccounts, setShowAllAccounts] = useState(false);

  const { data: accounts = [], isLoading, refetch } = useQuery<Account[]>({
    queryKey: ["/api/accounts"],
  });

  const calculateTotalUsd = () => {
    // This is a simplified calculation - in a real app you'd use proper FX rates
    const total = accounts.reduce((sum, account) => {
      let usdValue = parseFloat(account.balance);
      if (account.currency === 'KES') usdValue *= 0.0067;
      else if (account.currency === 'NGN') usdValue *= 0.00125;
      return sum + usdValue;
    }, 0);
    return total.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading treasury data...</p>
        </div>
      </div>
    );
  }

  const visibleAccounts = showAllAccounts ? accounts : accounts.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <FloatingBackground />
      
      {/* Header */}
      <header className="bg-white material-elevation-2 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center hover-lift transition-all duration-300 cursor-pointer">
              <Building2 className="text-blue-600 h-8 w-8 mr-3 hover-rotate hover-bounce" />
              <h1 className="text-2xl font-bold text-gray-900 hover-slide">Treasury Movement Simulator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 hover-lift hover-glow transition-all duration-300 cursor-pointer">
                <TrendingUp className="text-green-600 mr-2 h-4 w-4 hover-bounce" />
                <span className="text-sm font-medium hover-scale">Total: {calculateTotalUsd()}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => refetch()} className="hover-lift hover-bounce transition-all duration-300">
                <RefreshCw className="h-4 w-4 mr-2 hover-rotate" />
                <span className="hover-slide">Refresh</span>
              </Button>
              <Button variant="ghost" size="sm" className="hover-lift hover-bounce transition-all duration-300">
                <Bell className="h-4 w-4 hover-float" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Quick Stats */}
        <QuickStats accounts={accounts} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Dashboard */}
          <div className="lg:col-span-2">
            <Card className="material-elevation-1">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Account Dashboard</h2>
                  <Button variant="outline" size="sm" onClick={() => refetch()} className="hover-lift hover-bounce transition-all duration-300">
                    <RefreshCw className="h-4 w-4 mr-2 hover-rotate" />
                    <span className="hover-slide">Refresh</span>
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {visibleAccounts.map((account, index) => (
                    <div key={account.id} style={{ animationDelay: `${index * 100}ms` }}>
                      <AccountCard account={account} />
                    </div>
                  ))}
                </div>
                
                {accounts.length > 6 && (
                  <div className="text-center">
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowAllAccounts(!showAllAccounts)}
                      className="hover-lift hover-bounce transition-all duration-300"
                    >
                      <span className="hover-slide">{showAllAccounts ? "Show Less" : `Show ${accounts.length - 6} More Accounts`}</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Transfer Form */}
          <div className="lg:col-span-1">
            <TransferForm accounts={accounts} />
          </div>
        </div>

        {/* Transaction Log */}
        <div className="mt-8">
          <TransactionLog 
            accounts={accounts.map(acc => ({ 
              id: acc.id, 
              name: acc.name, 
              currency: acc.currency 
            }))} 
          />
        </div>
      </div>
    </div>
  );
}
