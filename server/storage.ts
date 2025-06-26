import { accounts, transactions, type Account, type InsertAccount, type Transaction, type InsertTransaction } from "@shared/schema";

export interface IStorage {
  // Account operations
  getAllAccounts(): Promise<Account[]>;
  getAccount(id: string): Promise<Account | undefined>;
  updateAccountBalance(id: string, newBalance: string): Promise<Account | undefined>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getAllTransactions(): Promise<Transaction[]>;
  getTransactionsByFilters(filters: {
    accountId?: string;
    currency?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Transaction[]>;
}

export class MemStorage implements IStorage {
  private accounts: Map<string, Account>;
  private transactions: Map<number, Transaction>;
  private transactionIdCounter: number;

  constructor() {
    this.accounts = new Map();
    this.transactions = new Map();
    this.transactionIdCounter = 1;
    this.initializeAccounts();
  }

  private initializeAccounts() {
    const initialAccounts: Account[] = [
      {
        id: "mpesa_kes_1",
        name: "Mpesa_KES_1",
        provider: "Mpesa",
        currency: "KES",
        balance: "1250000.00",
        accountType: "mobile_money"
      },
      {
        id: "uba_ngn_1",
        name: "UBA_NGN_1",
        provider: "UBA",
        currency: "NGN",
        balance: "3500000.00",
        accountType: "bank"
      },
      {
        id: "chase_usd_1",
        name: "Chase_USD_1",
        provider: "Chase",
        currency: "USD",
        balance: "25000.00",
        accountType: "bank"
      },
      {
        id: "airtel_kes_2",
        name: "Airtel_KES_2",
        provider: "Airtel",
        currency: "KES",
        balance: "850000.00",
        accountType: "mobile_money"
      },
      {
        id: "gtbank_ngn_2",
        name: "GTBank_NGN_2",
        provider: "GTBank",
        currency: "NGN",
        balance: "2100000.00",
        accountType: "bank"
      },
      {
        id: "wise_usd_2",
        name: "Wise_USD_2",
        provider: "Wise",
        currency: "USD",
        balance: "12500.00",
        accountType: "digital_wallet"
      },
      {
        id: "tigo_kes_3",
        name: "Tigo_KES_3",
        provider: "Tigo",
        currency: "KES",
        balance: "600000.00",
        accountType: "mobile_money"
      },
      {
        id: "zenith_ngn_3",
        name: "Zenith_NGN_3",
        provider: "Zenith",
        currency: "NGN",
        balance: "1800000.00",
        accountType: "bank"
      },
      {
        id: "paypal_usd_3",
        name: "PayPal_USD_3",
        provider: "PayPal",
        currency: "USD",
        balance: "8750.00",
        accountType: "digital_wallet"
      },
      {
        id: "equity_kes_4",
        name: "Equity_KES_4",
        provider: "Equity",
        currency: "KES",
        balance: "2200000.00",
        accountType: "bank"
      }
    ];

    initialAccounts.forEach(account => {
      this.accounts.set(account.id, account);
    });
  }

  async getAllAccounts(): Promise<Account[]> {
    return Array.from(this.accounts.values());
  }

  async getAccount(id: string): Promise<Account | undefined> {
    return this.accounts.get(id);
  }

  async updateAccountBalance(id: string, newBalance: string): Promise<Account | undefined> {
    const account = this.accounts.get(id);
    if (!account) return undefined;

    const updatedAccount = { ...account, balance: newBalance };
    this.accounts.set(id, updatedAccount);
    return updatedAccount;
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const newTransaction: Transaction = {
      id,
      fromAccountId: transaction.fromAccountId,
      toAccountId: transaction.toAccountId,
      fromAccountName: transaction.fromAccountName,
      toAccountName: transaction.toAccountName,
      amountSent: transaction.amountSent,
      amountReceived: transaction.amountReceived,
      fromCurrency: transaction.fromCurrency,
      toCurrency: transaction.toCurrency,
      exchangeRate: transaction.exchangeRate ?? null,
      notes: transaction.notes ?? null,
      status: transaction.status ?? "completed",
      transferDate: transaction.transferDate,
      createdAt: new Date(),
    };
    
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getTransactionsByFilters(filters: {
    accountId?: string;
    currency?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Transaction[]> {
    let filteredTransactions = Array.from(this.transactions.values());

    if (filters.accountId) {
      filteredTransactions = filteredTransactions.filter(
        t => t.fromAccountId === filters.accountId || t.toAccountId === filters.accountId
      );
    }

    if (filters.currency) {
      filteredTransactions = filteredTransactions.filter(
        t => t.fromCurrency === filters.currency || t.toCurrency === filters.currency
      );
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filteredTransactions = filteredTransactions.filter(
        t => new Date(t.transferDate) >= fromDate
      );
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      filteredTransactions = filteredTransactions.filter(
        t => new Date(t.transferDate) <= toDate
      );
    }

    return filteredTransactions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export const storage = new MemStorage();
