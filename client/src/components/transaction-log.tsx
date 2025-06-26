import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@shared/schema";
import { formatCurrency, getCurrencyFlag, getCurrencyColor } from "@/lib/currency";
import { format } from "date-fns";
import { CheckCircle, Clock, XCircle } from "lucide-react";

interface TransactionLogProps {
  accounts: { id: string; name: string; currency: string }[];
}

export default function TransactionLog({ accounts }: TransactionLogProps) {
  const [accountFilter, setAccountFilter] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions", accountFilter, currencyFilter, dateFromFilter, dateToFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (accountFilter && accountFilter !== "all") params.append("accountId", accountFilter);
      if (currencyFilter && currencyFilter !== "all") params.append("currency", currencyFilter);
      if (dateFromFilter) params.append("dateFrom", dateFromFilter);
      if (dateToFilter) params.append("dateTo", dateToFilter);
      
      const response = await fetch(`/api/transactions?${params}`);
      return response.json();
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-100 text-green-800",
      processing: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
        <div className="flex items-center">
          {getStatusIcon(status)}
          <span className="ml-1 capitalize">{status}</span>
        </div>
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card className="material-elevation-1">
        <CardContent className="p-6">
          <div className="text-center">Loading transactions...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="material-elevation-1 animate-fade-in-scale">
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="animate-slide-in-left">Transaction Log</span>
        </CardTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-slide-in-right">
          <Select value={accountFilter} onValueChange={setAccountFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Accounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Currencies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Currencies</SelectItem>
              <SelectItem value="KES">🇰🇪 KES</SelectItem>
              <SelectItem value="USD">🇺🇸 USD</SelectItem>
              <SelectItem value="NGN">🇳🇬 NGN</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">From Date</label>
            <Input
              type="date"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">To Date</label>
            <Input
              type="date"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setAccountFilter("");
                setCurrencyFilter("");
                setDateFromFilter("");
                setDateToFilter("");
              }}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Amount Sent</TableHead>
                <TableHead>Amount Received</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    <div className="animate-pulse-gentle">
                      No transactions found
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction, index) => (
                  <TableRow 
                    key={transaction.id} 
                    className="hover:bg-gray-50 transition-all duration-300 animate-slide-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="whitespace-nowrap text-sm">
                      {format(new Date(transaction.transferDate), "yyyy-MM-dd HH:mm")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center animate-slide-in-left">
                        <span className="mr-2 animate-pulse-gentle">{getCurrencyFlag(transaction.fromCurrency)}</span>
                        <span className="text-sm font-medium">{transaction.fromAccountName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center animate-slide-in-right">
                        <span className="mr-2 animate-pulse-gentle">{getCurrencyFlag(transaction.toCurrency)}</span>
                        <span className="text-sm font-medium">{transaction.toAccountName}</span>
                      </div>
                    </TableCell>
                    <TableCell className={`text-sm font-semibold ${getCurrencyColor(transaction.fromCurrency)} animate-count-up`}>
                      {formatCurrency(transaction.amountSent, transaction.fromCurrency)}
                    </TableCell>
                    <TableCell className={`text-sm font-semibold ${getCurrencyColor(transaction.toCurrency)} animate-count-up`}>
                      {formatCurrency(transaction.amountReceived, transaction.toCurrency)}
                    </TableCell>
                    <TableCell>
                      <div className="animate-fade-in-scale">
                        {getStatusBadge(transaction.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 max-w-xs truncate">
                      {transaction.notes || "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
