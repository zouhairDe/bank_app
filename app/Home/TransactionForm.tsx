import React, { useState } from 'react';
import { useExtendedStatus } from '@/hooks/useExtendedStatus';

const TransactionForm = ({ onTransactionComplete }: { onTransactionComplete:(e: number) => void; }) => {
  const { session } = useExtendedStatus();
  const [amount, setAmount] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      if (!session?.user.id) {
        throw new Error('User not authenticated');
      }
  
      const response = await fetch('/api/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: session.user.id,
          recipient,
          amount,
        }),
      });
  
      if (!response.ok) {
        let errorMessage;
        try {
          const data = await response.json();
          errorMessage = data.message;
        } catch (e) {
          errorMessage = await response.text();
        }
        throw new Error(errorMessage);
      }
      setSuccess(true);
      // Call the callback with the new balance
      console.log('session.user.balance', session.user.balance);
      onTransactionComplete?.(session.user.balance - amount);
      setError(null);
  
      // Reset the form fields
      setAmount(0);
      setRecipient('');
    } catch (error: any) {
      console.error('Error processing transaction:', error);
      setError(error.message || 'Failed to process transaction');
      setSuccess(false);
    }
  };

  return (
    <div className="h-fit">
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-4 rounded-xl mb-6 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 border border-green-500/30 text-green-200 p-4 rounded-xl mb-6 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Transaction completed successfully!</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-slate-400 text-lg">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="block w-full pl-8 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 backdrop-blur-sm"
              placeholder="0.00"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Recipient Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <input
              type="email"
              className="block w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 backdrop-blur-sm"
              placeholder="recipient@example.com"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Send Money
        </button>
      </form>

      {/* Transaction Tips */}
      <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-300 mb-1">Security Tips</h4>
            <ul className="text-xs text-blue-200/80 space-y-1">
              <li>• Double-check recipient email before sending</li>
              <li>• Transactions are processed instantly</li>
              <li>• Keep your account secure</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;