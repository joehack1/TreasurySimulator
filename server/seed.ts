import { db } from "./db";
import { accounts } from "@shared/schema";

const initialAccounts = [
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

async function seedDatabase() {
  try {
    console.log("Seeding database with initial accounts...");
    
    // Check if accounts already exist
    const existingAccounts = await db.select().from(accounts);
    
    if (existingAccounts.length === 0) {
      await db.insert(accounts).values(initialAccounts);
      console.log("Successfully seeded database with 10 accounts");
    } else {
      console.log("Database already contains accounts, skipping seed");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase();