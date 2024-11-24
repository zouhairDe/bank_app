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
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Send Money</h2>
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-500 text-white p-4 rounded-lg mb-4">
          <p>Transaction completed successfully.</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-400">Amount</span>
          <input
            type="number"
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />
        </label>
        <label className="block">
          <span className="text-gray-400">Recipient email address</span>
          <input
            type="text"
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;