"use client";

import { useEffect, useState } from 'react';
import { AlertCircle, ArrowDown, ArrowUp, CheckCircle, Clock, Filter, RefreshCw, X } from 'lucide-react';
import CryptoJS from 'crypto-js';
import { generateMockTransactions } from '@/lib/mockTransactions';
import type { Party, Transaction } from '@/lib/mockTransactions';

// Function to hash data for local storage
const hashData = (data: Transaction[]) => {
  const stringData = JSON.stringify(data);
  return CryptoJS.AES.encrypt(stringData, 'secure-bank-transaction-key').toString();
};

// Function to decrypt hashed data
const unhashData = (hashedData: string): Transaction[] => {
  try {
    const bytes = CryptoJS.AES.decrypt(hashedData, 'secure-bank-transaction-key');
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Failed to decrypt transaction data", error);
    return [];
  }
};

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Apply filters to transactions
  useEffect(() => {
    if (filter === 'all') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter(t => t.type === filter));
    }
  }, [transactions, filter]);

  // Function to fetch transactions from API
  const fetchTransactions = async (silent = false) => {
    if (!silent) {
      setIsLoading(true);
    } else {
      setRefreshing(true);
    }
    
    try {
      // In development, use mock data
      if (process.env.NODE_ENV !== 'production') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockTransactions = generateMockTransactions(8);
        
        // Store encrypted data in local storage
        localStorage.setItem('secure-bank-transactions', hashData(mockTransactions));
        
        setTransactions(mockTransactions);
        setError(null);
      } else {
        // In production, use real API
        const response = await fetch('/api/get-transactions?limit=10');
        
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        
        const data = await response.json();
        
        // Store encrypted data in local storage
        localStorage.setItem('secure-bank-transactions', hashData(data.transactions));
        
        setTransactions(data.transactions);
        setError(null);
      }
    } catch (err) {
      if (!silent) {
        setError('Failed to load transactions. Please try again later.');
        console.error('Error fetching transactions:', err);
      }
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    // Function to handle loading transactions
    const loadTransactions = async () => {
      // Try to load transactions from local storage first
      const cachedData = localStorage.getItem('secure-bank-transactions');
      
      if (cachedData) {
        try {
          const decryptedData = unhashData(cachedData);
          if (isMounted) {
            setTransactions(decryptedData);
            setIsLoading(false);
          }
          
          // Silently fetch fresh data in the background
          fetchTransactions(true);
        } catch (err) {
          console.error('Error loading cached transactions:', err);
          // If cache fails, fetch from API
          fetchTransactions();
        }
      } else {
        // No cache, fetch from API
        fetchTransactions();
      }
    };
    
    loadTransactions();
    
    // Set up interval to refresh data every 2 minutes
    const intervalId = setInterval(() => {
      fetchTransactions(true);
    }, 2 * 60 * 1000);
    
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status icon based on transaction status
  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'failed':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  // Render loading state
  if (isLoading && transactions.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/40 rounded-xl p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-700 rounded w-24"></div>
                  <div className="h-3 bg-slate-700 rounded w-32"></div>
                </div>
              </div>
              <div className="h-6 bg-slate-700 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Render error state
  if (error && transactions.length === 0) {
    return (
      <div className="bg-red-900/20 backdrop-blur-sm border border-red-800/40 rounded-xl p-6 text-center">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-red-200">{error}</p>
        <button 
          onClick={() => fetchTransactions()}
          className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Render empty state
  if (filteredTransactions.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-slate-800/60 rounded-lg flex p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('sent')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                filter === 'sent' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              Sent
            </button>
            <button
              onClick={() => setFilter('received')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                filter === 'received' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              Received
            </button>
          </div>
          <button 
            onClick={() => fetchTransactions(true)}
            className={`p-2 rounded-md bg-slate-800/60 text-slate-300 hover:bg-slate-700 transition-colors ${
              refreshing ? 'animate-spin' : ''
            }`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/40 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-slate-700/60 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Clock className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-300 mb-2">No Transactions Found</h3>
          <p className="text-slate-400">
            {filter === 'all' 
              ? "You haven't made any transactions yet. Send money to get started."
              : filter === 'sent'
                ? "You haven't sent any money yet."
                : "You haven't received any money yet."
            }
          </p>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Show All Transactions
            </button>
          )}
        </div>
      </div>
    );
  }

  // Render transactions
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="bg-slate-800/60 rounded-lg flex p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('sent')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                filter === 'sent' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              Sent
            </button>
            <button
              onClick={() => setFilter('received')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                filter === 'received' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              Received
            </button>
          </div>
          <button 
            onClick={() => fetchTransactions(true)}
            disabled={refreshing}
            className={`p-2 rounded-md bg-slate-800/60 text-slate-300 hover:bg-slate-700 transition-colors ${
              refreshing ? 'animate-spin' : ''
            }`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Desktop view (table) */}
      <div className="hidden md:block overflow-hidden bg-slate-800/30 backdrop-blur-sm border border-slate-700/40 rounded-xl">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/40">
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Email</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-slate-700/20 hover:bg-slate-700/20">
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <StatusIcon status={transaction.status} />
                    <span className="ml-2 text-sm font-medium text-slate-300 capitalize">
                      {transaction.status}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-slate-300">
                  {transaction.party.name}
                </td>
                <td className="py-3 px-4 text-sm text-slate-400">
                  {transaction.party.email}
                </td>
                <td className="py-3 px-4 text-sm text-slate-400">
                  {formatDate(transaction.timestamp)}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end">
                    {transaction.type === 'sent' ? 
                      <ArrowUp className="w-4 h-4 text-red-400 mr-1" /> : 
                      <ArrowDown className="w-4 h-4 text-emerald-400 mr-1" />
                    }
                    <span className={`text-sm font-medium ${
                      transaction.type === 'sent' ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      ${transaction.amount.toFixed(2)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view (cards) */}
      <div className="md:hidden space-y-3">
        {filteredTransactions.map((transaction) => (
          <div 
            key={transaction.id}
            className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/40 rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <StatusIcon status={transaction.status} />
                <span className="ml-2 text-sm font-medium text-slate-300 capitalize">
                  {transaction.status}
                </span>
              </div>
              <div className="flex items-center">
                {transaction.type === 'sent' ? 
                  <ArrowUp className="w-4 h-4 text-red-400 mr-1" /> : 
                  <ArrowDown className="w-4 h-4 text-emerald-400 mr-1" />
                }
                <span className={`text-sm font-medium ${
                  transaction.type === 'sent' ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  ${transaction.amount.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="space-y-1 mb-2">
              <div className="text-sm text-slate-300">{transaction.party.name}</div>
              <div className="text-xs text-slate-400">{transaction.party.email}</div>
            </div>
            <div className="text-xs text-slate-500">
              {formatDate(transaction.timestamp)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
