import { Bank, BankType, BankTransaction, BankConnection, BankAccount } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simulação de dados de bancos disponíveis
const AVAILABLE_BANKS: Omit<Bank, 'isConnected' | 'connectedAt' | 'accountNumber' | 'accountName'>[] = [
  {
    id: '1',
    name: 'Nubank',
    type: BankType.NUBANK,
    logo: '💳',
    color: '#8A05BE',
  },
  {
    id: '2',
    name: 'Itaú',
    type: BankType.ITAU,
    logo: '🏦',
    color: '#EC7000',
  },
  {
    id: '3',
    name: 'Santander',
    type: BankType.SANTANDER,
    logo: '🏛️',
    color: '#EC0000',
  },
  {
    id: '4',
    name: 'Bradesco',
    type: BankType.BRADESCO,
    logo: '🏦',
    color: '#CC092F',
  },
  {
    id: '5',
    name: 'Caixa',
    type: BankType.CAIXA,
    logo: '🏛️',
    color: '#0065A8',
  },
  {
    id: '6',
    name: 'Banco do Brasil',
    type: BankType.BANCO_DO_BRASIL,
    logo: '🏦',
    color: '#FFCD00',
  },
  {
    id: '7',
    name: 'Inter',
    type: BankType.INTER,
    logo: '💳',
    color: '#FF7A00',
  },
  {
    id: '8',
    name: 'Original',
    type: BankType.ORIGINAL,
    logo: '💳',
    color: '#FF6B00',
  },
  {
    id: '9',
    name: 'C6 Bank',
    type: BankType.C6,
    logo: '💳',
    color: '#000000',
  },
];

class BankService {
  private readonly STORAGE_KEY = '@financesapp:bank_connections';
  private readonly TRANSACTIONS_KEY = '@financesapp:bank_transactions';

  /**
   * Obtém lista de bancos disponíveis
   */
  async getAvailableBanks(userId: string): Promise<Bank[]> {
    const connections = await this.getConnections(userId);
    const connectedBankIds = new Set(connections.map(c => c.bankId));

    return AVAILABLE_BANKS.map(bank => {
      const connection = connections.find(c => c.bankId === bank.id);
      return {
        ...bank,
        isConnected: connectedBankIds.has(bank.id),
        connectedAt: connection?.connectedAt,
        accountNumber: connection?.accountInfo.accountNumber,
        accountName: connection?.accountInfo.accountName,
      };
    });
  }

  /**
   * Conecta a um banco (simulação de autenticação)
   */
  async connectBank(
    userId: string,
    bankId: string,
    credentials: { accountNumber: string; password?: string }
  ): Promise<BankConnection> {
    // Simulação de autenticação
    // Em produção, isso faria uma chamada real à API do banco ou Open Banking
    
    const bank = AVAILABLE_BANKS.find(b => b.id === bankId);
    if (!bank) {
      throw new Error('Banco não encontrado');
    }

    // Simula delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1500));

    const connection: BankConnection = {
      id: `conn_${Date.now()}`,
      bankId,
      bankType: bank.type,
      userId,
      accessToken: `token_${Date.now()}`,
      accountInfo: {
        accountNumber: credentials.accountNumber,
        accountName: `Conta ${bank.name}`,
        balance: Math.random() * 10000, // Simulação de saldo
      },
      connectedAt: new Date().toISOString(),
      lastSyncAt: new Date().toISOString(),
    };

    const connections = await this.getConnections(userId);
    connections.push(connection);
    await AsyncStorage.setItem(
      `${this.STORAGE_KEY}_${userId}`,
      JSON.stringify(connections)
    );

    return connection;
  }

  /**
   * Desconecta um banco
   */
  async disconnectBank(userId: string, bankId: string): Promise<void> {
    const connections = await this.getConnections(userId);
    const filtered = connections.filter(c => c.bankId !== bankId);
    await AsyncStorage.setItem(
      `${this.STORAGE_KEY}_${userId}`,
      JSON.stringify(filtered)
    );
  }

  /**
   * Obtém conexões do usuário
   */
  async getConnections(userId: string): Promise<BankConnection[]> {
    try {
      const data = await AsyncStorage.getItem(`${this.STORAGE_KEY}_${userId}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading connections:', error);
      return [];
    }
  }

  /**
   * Sincroniza transações de um banco
   */
  async syncTransactions(
    userId: string,
    bankId: string,
    connection: BankConnection
  ): Promise<BankTransaction[]> {
    // Simulação de sincronização
    // Em produção, isso faria uma chamada real à API do banco
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Gera transações simuladas
    const transactions: BankTransaction[] = this.generateMockTransactions(
      bankId,
      connection.bankType
    );

    // Salva transações
    const allTransactions = await this.getTransactions(userId);
    const existingIds = new Set(allTransactions.map(t => t.id));
    const newTransactions = transactions.filter(t => !existingIds.has(t.id));
    
    if (newTransactions.length > 0) {
      const updated = [...allTransactions, ...newTransactions];
      await AsyncStorage.setItem(
        `${this.TRANSACTIONS_KEY}_${userId}`,
        JSON.stringify(updated)
      );

      // Atualiza última sincronização
      const connections = await this.getConnections(userId);
      const updatedConnections = connections.map(c => 
        c.id === connection.id 
          ? { ...c, lastSyncAt: new Date().toISOString() }
          : c
      );
      await AsyncStorage.setItem(
        `${this.STORAGE_KEY}_${userId}`,
        JSON.stringify(updatedConnections)
      );
    }

    return newTransactions;
  }

  /**
   * Obtém transações bancárias do usuário
   */
  async getTransactions(userId: string, bankId?: string): Promise<BankTransaction[]> {
    try {
      const data = await AsyncStorage.getItem(`${this.TRANSACTIONS_KEY}_${userId}`);
      const transactions: BankTransaction[] = data ? JSON.parse(data) : [];
      
      if (bankId) {
        return transactions.filter(t => t.bankId === bankId);
      }
      
      return transactions;
    } catch (error) {
      console.error('Error loading transactions:', error);
      return [];
    }
  }

  /**
   * Gera transações simuladas para demonstração
   */
  private generateMockTransactions(
    bankId: string,
    bankType: BankType
  ): BankTransaction[] {
    const bank = AVAILABLE_BANKS.find(b => b.id === bankId);
    const transactions: BankTransaction[] = [];
    const now = new Date();

    // Gera 10-15 transações aleatórias dos últimos 30 dias
    const count = Math.floor(Math.random() * 6) + 10;
    
    for (let i = 0; i < count; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);
      
      const isCredit = Math.random() > 0.6;
      const amount = Math.random() * 2000 + 50;
      
      const descriptions = isCredit
        ? [
            'Salário',
            'Transferência recebida',
            'Reembolso',
            'Dividendos',
            'Freelance',
          ]
        : [
            'Supermercado',
            'Restaurante',
            'Combustível',
            'Farmácia',
            'Conta de luz',
            'Internet',
            'Netflix',
            'Uber',
          ];

      transactions.push({
        id: `trans_${bankId}_${Date.now()}_${i}`,
        bankId,
        bankName: bank?.name || 'Banco',
        type: isCredit ? 'credit' : 'debit',
        amount: parseFloat(amount.toFixed(2)),
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        date: date.toISOString(),
        category: this.getCategoryForDescription(
          descriptions[Math.floor(Math.random() * descriptions.length)]
        ),
        metadata: {
          merchant: isCredit ? undefined : descriptions[Math.floor(Math.random() * descriptions.length)],
        },
      });
    }

    // Ordena por data (mais recente primeiro)
    return transactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  private getCategoryForDescription(description: string): string {
    const categories: { [key: string]: string } = {
      'Salário': 'salary',
      'Transferência recebida': 'transfer',
      'Supermercado': 'food',
      'Restaurante': 'food',
      'Combustível': 'transport',
      'Farmácia': 'health',
      'Conta de luz': 'utilities',
      'Internet': 'utilities',
      'Netflix': 'entertainment',
      'Uber': 'transport',
    };
    return categories[description] || 'other';
  }

  /**
   * Obtém informações da conta bancária
   */
  async getAccountInfo(userId: string, bankId: string): Promise<BankAccount | null> {
    const connections = await this.getConnections(userId);
    const connection = connections.find(c => c.bankId === bankId);
    
    if (!connection) {
      return null;
    }

    return {
      id: connection.id,
      bankId,
      accountNumber: connection.accountInfo.accountNumber,
      accountName: connection.accountInfo.accountName,
      balance: connection.accountInfo.balance || 0,
      currency: 'BRL',
      type: 'checking',
    };
  }
}

export default new BankService();

