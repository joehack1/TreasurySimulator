import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema } from "@shared/schema";
import { z } from "zod";

const transferSchema = z.object({
  fromAccountId: z.string(),
  toAccountId: z.string(),
  amount: z.string(),
  notes: z.string().optional(),
  transferDate: z.string(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all accounts
  app.get("/api/accounts", async (req, res) => {
    try {
      const accounts = await storage.getAllAccounts();
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch accounts" });
    }
  });

  // Get all transactions
  app.get("/api/transactions", async (req, res) => {
    try {
      const { accountId, currency, dateFrom, dateTo } = req.query;
      
      const filters = {
        accountId: accountId as string,
        currency: currency as string,
        dateFrom: dateFrom as string,
        dateTo: dateTo as string,
      };

      const transactions = await storage.getTransactionsByFilters(filters);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Create transfer
  app.post("/api/transfer", async (req, res) => {
    try {
      const { fromAccountId, toAccountId, amount, notes, transferDate } = transferSchema.parse(req.body);

      // Get accounts
      const fromAccount = await storage.getAccount(fromAccountId);
      const toAccount = await storage.getAccount(toAccountId);

      if (!fromAccount || !toAccount) {
        return res.status(404).json({ message: "Account not found" });
      }

      // Check balance
      const currentBalance = parseFloat(fromAccount.balance);
      const transferAmount = parseFloat(amount);

      if (currentBalance < transferAmount) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      // Calculate FX conversion
      const fxRates: Record<string, number> = {
        KES_USD: 0.0067,
        USD_KES: 150,
        NGN_USD: 0.00125,
        USD_NGN: 800,
        KES_NGN: 5.33,
        NGN_KES: 0.19
      };

      let receivedAmount = transferAmount;
      let exchangeRate: string | undefined;

      if (fromAccount.currency !== toAccount.currency) {
        const rateKey = `${fromAccount.currency}_${toAccount.currency}`;
        const rate = fxRates[rateKey];
        if (rate) {
          receivedAmount = transferAmount * rate;
          exchangeRate = rate.toString();
        }
      }

      // Update account balances
      const newFromBalance = (currentBalance - transferAmount).toString();
      const newToBalance = (parseFloat(toAccount.balance) + receivedAmount).toString();

      await storage.updateAccountBalance(fromAccountId, newFromBalance);
      await storage.updateAccountBalance(toAccountId, newToBalance);

      // Create transaction record
      const transaction = await storage.createTransaction({
        fromAccountId,
        toAccountId,
        fromAccountName: fromAccount.name,
        toAccountName: toAccount.name,
        amountSent: transferAmount.toString(),
        amountReceived: receivedAmount.toString(),
        fromCurrency: fromAccount.currency,
        toCurrency: toAccount.currency,
        exchangeRate,
        notes: notes || null,
        status: "completed",
        transferDate: new Date(transferDate),
      });

      res.json({ 
        success: true, 
        transaction,
        message: `Successfully transferred ${fromAccount.currency} ${transferAmount.toLocaleString()} to ${toAccount.name}`
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Transfer failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
