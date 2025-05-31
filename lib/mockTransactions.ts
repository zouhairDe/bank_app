// Mock transaction data generator

import { v4 as uuidv4 } from 'uuid';

export interface Party {
  name: string;
  email: string;
}

export interface Transaction {
  id: string;
  amount: number;
  timestamp: string;
  type: 'sent' | 'received';
  status: 'pending' | 'completed' | 'failed';
  party: Party;
}

const mockRecipients: Party[] = [
  { name: 'Sarah Johnson', email: 'sarah.j@example.com' },
  { name: 'Michael Thompson', email: 'michael.t@example.com' },
  { name: 'Emma Rodriguez', email: 'emma.r@example.com' },
  { name: 'James Wilson', email: 'james.w@example.com' },
  { name: 'Olivia Martinez', email: 'olivia.m@example.com' },
  { name: 'Noah Davis', email: 'noah.d@example.com' },
  { name: 'Sophia Anderson', email: 'sophia.a@example.com' },
  { name: 'Liam Garcia', email: 'liam.g@example.com' }
];

// Generate a random date within the last 30 days
const randomDate = () => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);
  
  now.setDate(now.getDate() - daysAgo);
  now.setHours(now.getHours() - hoursAgo);
  now.setMinutes(now.getMinutes() - minutesAgo);
  
  return now.toISOString();
};

// Generate a random transaction amount between 1 and 2000
const randomAmount = () => {
  return parseFloat((Math.random() * 2000 + 1).toFixed(2));
};

// Generate a random status with weighted distribution
const randomStatus = () => {
  const rand = Math.random();
  // 80% completed, 15% pending, 5% failed
  if (rand < 0.8) return 'completed';
  if (rand < 0.95) return 'pending';
  return 'failed';
};

// Generate mock transactions
export const generateMockTransactions = (count: number = 10): Transaction[] => {
  return Array.from({ length: count }, () => {
    const type = Math.random() > 0.5 ? 'sent' : 'received';
    const status = randomStatus();
    
    return {
      id: uuidv4(),
      amount: randomAmount(),
      timestamp: randomDate(),
      type,
      status,
      party: mockRecipients[Math.floor(Math.random() * mockRecipients.length)]
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
