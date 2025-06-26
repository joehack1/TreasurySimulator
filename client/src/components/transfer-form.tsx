import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Account } from "@shared/schema";
import { formatCurrency, getCurrencyFlag } from "@/lib/currency";
import { convertCurrency, getExchangeRate } from "@/lib/fx-rates";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Send, ArrowRightLeft } from "lucide-react";

interface TransferFormProps {
  accounts: Account[];
}

export default function TransferForm({ accounts }: TransferFormProps) {
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const transferMutation = useMutation({
    mutationFn: async (data: { fromAccountId: string; toAccountId: string; amount: string; notes?: string; transferDate: string }) => {
      const response = await apiRequest("POST", "/api/transfer", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Transfer Successful!",
        description: data.message,
      });
      
      // Reset form
      setFromAccount("");
      setToAccount("");
      setAmount("");
      setNotes("");
      setTransferDate(new Date().toISOString().split('T')[0]);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/accounts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
    onError: (error: any) => {
      toast({
        title: "Transfer Failed",
        description: error.message || "An error occurred during the transfer",
        variant: "destructive",
      });
    },
  });

  const availableFromAccounts = accounts.filter(acc => parseFloat(acc.balance) > 0);
  const availableToAccounts = accounts.filter(acc => acc.id !== fromAccount);

  const selectedFromAccount = accounts.find(acc => acc.id === fromAccount);
  const selectedToAccount = accounts.find(acc => acc.id === toAccount);

  const getFxPreview = () => {
    if (!selectedFromAccount || !selectedToAccount || !amount) return null;
    if (selectedFromAccount.currency === selectedToAccount.currency) return null;

    try {
      const amountNumber = parseFloat(amount);
      const { convertedAmount, rate } = convertCurrency(
        amountNumber,
        selectedFromAccount.currency,
        selectedToAccount.currency
      );

      return {
        sendAmount: formatCurrency(amountNumber, selectedFromAccount.currency),
        receiveAmount: formatCurrency(convertedAmount, selectedToAccount.currency),
        rate: `1 ${selectedFromAccount.currency} = ${rate} ${selectedToAccount.currency}`
      };
    } catch {
      return null;
    }
  };

  const fxPreview = getFxPreview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fromAccount || !toAccount || !amount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (fromAccount === toAccount) {
      toast({
        title: "Validation Error",
        description: "Cannot transfer to the same account",
        variant: "destructive",
      });
      return;
    }

    const amountNumber = parseFloat(amount);
    const fromAccountData = accounts.find(acc => acc.id === fromAccount);
    
    if (!fromAccountData || parseFloat(fromAccountData.balance) < amountNumber) {
      toast({
        title: "Insufficient Funds",
        description: "Account balance is too low for this transfer",
        variant: "destructive",
      });
      return;
    }

    transferMutation.mutate({
      fromAccountId: fromAccount,
      toAccountId: toAccount,
      amount,
      notes: notes || undefined,
      transferDate,
    });
  };

  return (
    <Card className="material-elevation-1 sticky top-24 animate-fade-in-scale">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Send className="mr-2 h-5 w-5 animate-bounce-gentle" />
          New Transfer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="fromAccount">From Account</Label>
            <Select value={fromAccount} onValueChange={setFromAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Select source account" />
              </SelectTrigger>
              <SelectContent>
                {availableFromAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center">
                      <span className="mr-2">{getCurrencyFlag(account.currency)}</span>
                      {account.name} ({formatCurrency(account.balance, account.currency)})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="toAccount">To Account</Label>
            <Select value={toAccount} onValueChange={setToAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination account" />
              </SelectTrigger>
              <SelectContent>
                {availableToAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center">
                      <span className="mr-2">{getCurrencyFlag(account.currency)}</span>
                      {account.name} ({formatCurrency(account.balance, account.currency)})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
              {selectedFromAccount && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 font-medium">
                    {selectedFromAccount.currency}
                  </span>
                </div>
              )}
            </div>
          </div>

          {fxPreview && (
            <Alert className="bg-blue-50 border-blue-200 animate-slide-in animate-glow">
              <ArrowRightLeft className="h-4 w-4 text-blue-600 animate-pulse-gentle" />
              <AlertDescription>
                <div className="text-blue-800">
                  <p className="font-medium">FX Conversion</p>
                  <p className="text-sm">Sending: <span className="font-semibold animate-shimmer">{fxPreview.sendAmount}</span></p>
                  <p className="text-sm">Rate: <span className="font-semibold">{fxPreview.rate}</span></p>
                  <p className="text-sm">Receiving: <span className="font-semibold text-green-600 animate-count-up">{fxPreview.receiveAmount}</span></p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="transferDate">Transfer Date</Label>
            <Input
              id="transferDate"
              type="date"
              value={transferDate}
              onChange={(e) => setTransferDate(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add transfer notes..."
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full material-elevation-2 hover:material-elevation-4"
            disabled={transferMutation.isPending}
          >
            <Send className="mr-2 h-4 w-4" />
            {transferMutation.isPending ? "Processing..." : "Execute Transfer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
