export enum BankType {
  NUBANK = 'nubank',
  ITAU = 'itau',
  SANTANDER = 'santander',
  BRADESCO = 'bradesco',
  CAIXA = 'caixa',
  BANCO_DO_BRASIL = 'banco_do_brasil',
  INTER = 'inter',
  ORIGINAL = 'original',
  C6 = 'c6',
}

export interface Bank {
  id: string;
  name: string;
  type: BankType;
  logo: string;
  color: string;
  isConnected: boolean;
  connectedAt?: string;
  accountNumber?: string;
  accountName?: string;
}

export interface BankTransaction {
  id: string;
  bankId: string;
  bankName: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  category?: string;
  metadata?: {
    merchant?: string;
    location?: string;
    reference?: string;
  };
}

export interface BankConnection {
  id: string;
  bankId: string;
  bankType: BankType;
  userId: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  accountInfo: {
    accountNumber: string;
    accountName: string;
    balance?: number;
  };
  connectedAt: string;
  lastSyncAt?: string;
}

export interface BankAccount {
  id: string;
  bankId: string;
  accountNumber: string;
  accountName: string;
  balance: number;
  currency: string;
  type: 'checking' | 'savings' | 'credit';
}

