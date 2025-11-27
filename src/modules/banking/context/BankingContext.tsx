import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { Bank, BankTransaction, BankConnection, BankAccount } from '../types';
import bankService from '../services/bankService';
import AuthContext from '../../../hooks/auth';

interface BankingContextType {
  banks: Bank[];
  connections: BankConnection[];
  transactions: BankTransaction[];
  loading: boolean;
  syncing: boolean;
  loadBanks: () => Promise<void>;
  connectBank: (bankId: string, credentials: { accountNumber: string; password?: string }) => Promise<void>;
  disconnectBank: (bankId: string) => Promise<void>;
  syncBankTransactions: (bankId: string) => Promise<void>;
  syncAllBanks: () => Promise<void>;
  getAccountInfo: (bankId: string) => Promise<BankAccount | null>;
  getTransactionsByBank: (bankId: string) => BankTransaction[];
}

const BankingContext = createContext<BankingContextType>({
  banks: [],
  connections: [],
  transactions: [],
  loading: false,
  syncing: false,
  loadBanks: async () => {},
  connectBank: async () => {},
  disconnectBank: async () => {},
  syncBankTransactions: async () => {},
  syncAllBanks: async () => {},
  getAccountInfo: async () => null,
  getTransactionsByBank: () => [],
});

export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [connections, setConnections] = useState<BankConnection[]>([]);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const loadBanks = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const availableBanks = await bankService.getAvailableBanks(user.id);
      const userConnections = await bankService.getConnections(user.id);
      const userTransactions = await bankService.getTransactions(user.id);
      
      setBanks(availableBanks);
      setConnections(userConnections);
      setTransactions(userTransactions);
    } catch (error) {
      console.error('Error loading banks:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const connectBank = useCallback(async (
    bankId: string,
    credentials: { accountNumber: string; password?: string }
  ) => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const connection = await bankService.connectBank(user.id, bankId, credentials);
      await loadBanks();
      
      // Sincroniza transações após conectar
      await syncBankTransactions(bankId);
    } catch (error) {
      console.error('Error connecting bank:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user?.id, loadBanks]);

  const disconnectBank = useCallback(async (bankId: string) => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      await bankService.disconnectBank(user.id, bankId);
      await loadBanks();
      
      // Remove transações do banco desconectado
      setTransactions(prev => prev.filter(t => t.bankId !== bankId));
    } catch (error) {
      console.error('Error disconnecting bank:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user?.id, loadBanks]);

  const syncBankTransactions = useCallback(async (bankId: string) => {
    if (!user?.id) return;
    
    setSyncing(true);
    try {
      const connection = connections.find(c => c.bankId === bankId);
      if (!connection) {
        throw new Error('Conexão não encontrada');
      }
      
      const newTransactions = await bankService.syncTransactions(
        user.id,
        bankId,
        connection
      );
      
      // Atualiza lista de transações
      await loadBanks();
    } catch (error) {
      console.error('Error syncing transactions:', error);
      throw error;
    } finally {
      setSyncing(false);
    }
  }, [user?.id, connections, loadBanks]);

  const syncAllBanks = useCallback(async () => {
    if (!user?.id) return;
    
    setSyncing(true);
    try {
      const connectedBanks = connections.map(c => c.bankId);
      await Promise.all(
        connectedBanks.map(bankId => syncBankTransactions(bankId))
      );
    } catch (error) {
      console.error('Error syncing all banks:', error);
    } finally {
      setSyncing(false);
    }
  }, [user?.id, connections, syncBankTransactions]);

  const getAccountInfo = useCallback(async (bankId: string): Promise<BankAccount | null> => {
    if (!user?.id) return null;
    
    return await bankService.getAccountInfo(user.id, bankId);
  }, [user?.id]);

  const getTransactionsByBank = useCallback((bankId: string): BankTransaction[] => {
    return transactions.filter(t => t.bankId === bankId);
  }, [transactions]);

  useEffect(() => {
    if (user?.id) {
      loadBanks();
    }
  }, [user?.id, loadBanks]);

  return (
    <BankingContext.Provider
      value={{
        banks,
        connections,
        transactions,
        loading,
        syncing,
        loadBanks,
        connectBank,
        disconnectBank,
        syncBankTransactions,
        syncAllBanks,
        getAccountInfo,
        getTransactionsByBank,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};

export default BankingContext;

