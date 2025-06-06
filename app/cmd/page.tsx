"use client";

import { useExtendedStatus } from '@/hooks/useExtendedStatus';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface User {
  email: string;
  name: string;
  password: string;
  role: string;
  phoneNumber: string;
  image: string;
  location: string;
  gender: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
  balance: number;
  isBanned: boolean;
  isVerified: boolean;
  phoneNumberVerified: boolean;
  DataSubmitted: boolean;
}

interface Card {
  id: string;
  number: string;
  type: string;
  expiryDate: string;
  status: string;
}

interface Transaction {
  id: string;
  amount: number;
  recieverId: string;
  date: string;
  status: string;
}

interface CommandResponse {
  message: {
    users?: User[];
    cards?: Card[];
    transactions?: Transaction[];
    content?: string | string[];
  };
}

interface CardProps {
  title: string;
  content: React.ReactNode;
}

const renderPrompt = () => {
  return (
    <span>
      <span className="text-white">$</span>
      <span className="text-red-500">@</span>
      <span className="text-green-400">~/home/BankVault</span>
      <span className="text-green-400"> </span>
      <span className="text-red-500">bankAdmin</span>
      <span className="text-yellow-300">: (Only 1 command per time) </span>
      <span className="text-white">{"=> "}</span>
      <span className="text-white">$</span>
    </span>
  );
};

const Card: React.FC<CardProps> = ({ title, content }) => {
  return (
    <div className="bg-[#3e3e3e] text-white rounded-lg p-4 shadow-lg mb-4 max-w-fit mr-2">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="text-sm">{content}</div>
    </div>
  );
};

const renderTransactions = (transactions: Transaction[]) => {
  return transactions.map((transaction, index) => (
    <div className="flex flex-col" key={index}>
      <div><strong>Transaction ID:</strong> {transaction.id}</div>
      <div><strong>Amount:</strong> {transaction.amount}</div>
      <div><strong>Date:</strong> {new Date(transaction.date).toLocaleString()}</div>
      <div><strong>Status:</strong> {transaction.status}</div>
    </div>
  ));
};

const renderCards = (cards: Card[]) => {
  return cards.map((card, index) => (
    <div key={card.id} className="mb-4">
      <div><strong>Card Number:</strong> {card.number}</div>
      <div><strong>Card Type:</strong> {card.type}</div>
      <div><strong>Expiry Date:</strong> {new Date(card.expiryDate).toLocaleString()}</div>
      <div><strong>Status:</strong> {card.status}</div>
    </div>
  ));
};

const renderUserDetails = (user: User) => {
  return (
    <div className="flex flex-col flex-1">
      <div><strong>Name:</strong> {user.name}</div>
      <div><strong>Email:</strong> {user.email}</div>
      <div><strong>Password:</strong> {user.password}</div>
      <div><strong>Role:</strong> {user.role}</div>
      <div><strong>Phone Number:</strong> {user.phoneNumber}</div>
      <div><strong>Image:</strong> <Image src={user.image} alt="User Image" width={64} height={64} className="h-16 w-16 rounded-full" /></div>
      <div><strong>Location:</strong> {user.location}</div>
      <div><strong>Gender:</strong> {user.gender}</div>
      <div><strong>Provider:</strong> {user.provider}</div>
      <div><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</div>
      <div><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</div>
      <div><strong>Balance:</strong> {user.balance}$</div>
      <div><strong>Is Banned:</strong> {user.isBanned ? 'Yes' : 'No'}</div>
      <div><strong>Is Verified:</strong> {user.isVerified ? 'Yes' : 'No'}</div>
      <div><strong>Phone Number Verified:</strong> {user.phoneNumberVerified ? 'Yes' : 'No'}</div>
      <div><strong>Data Submitted:</strong> {user.DataSubmitted ? 'Yes' : 'No'}</div>
    </div>
  );
};

const renderUserSection = (user: User, cards: Card[], transactions: Transaction[]) => {
  return (
    <div className="flex flex-row space-x-4">
      {renderUserDetails(user)}
      {cards.length > 0 && (
        <div className="flex flex-col flex-1">
          <h4 className="text-lg font-semibold mb-2">Cards</h4>
          {renderCards(cards)}
        </div>
      )}
      {transactions.length > 0 && (
        <div className="flex flex-col flex-1">
          <h4 className="text-lg font-semibold mb-2">Transactions</h4>
          {renderTransactions(transactions)}
        </div>
      )}
    </div>
  );
};

const renderContent = (content: string | string[]) => {
  if (Array.isArray(content)) {
    return (
      <Card
        title="Command Output"
        content={
          <pre className="whitespace-pre-wrap">
            {content.join('\n')}
          </pre>
        }
      />
    );
  }
  return (
    <Card
      title="Command Output"
      content={
        <pre className="whitespace-pre-wrap">
          {content.replace(/,/g, '\n')}
        </pre>
      }
    />
  );
};

const renderOutput = (data: CommandResponse) => {
  const outputElements: JSX.Element[] = [];

  // Handle content if it exists
  if (data.message?.content) {
    outputElements.push(renderContent(data.message.content));
  }

  // Handle users, cards, and transactions
  if (data.message?.users) {
    data.message.users.forEach((user: User) => {
      const userCards = data.message?.cards || [];
      const userTransactions = data.message?.transactions || [];

      const userSection = renderUserSection(user, userCards, userTransactions);

      outputElements.push(
        <Card
          key={user.email}
          title={`User Profile - ${user.name}`}
          content={userSection}
        />
      );
    });
  } else if (data.message?.cards || data.message?.transactions) {
    // Render cards and transactions without user details
    const cards = data.message?.cards || [];
    const transactions = data.message?.transactions || [];

    if (cards.length > 0) {
      outputElements.push(
        <Card
          key="cards"
          title="Cards"
          content={renderCards(cards)}
        />
      );
    }

    if (transactions.length > 0) {
      outputElements.push(
        <Card
          key="transactions"
          title="Transactions"
          content={renderTransactions(transactions)}
        />
      );
    }
  }

  return outputElements;
};

const Terminal = () => {
  const [inputCmd, setInputCmd] = useState('');
  const [output, setOutput] = useState<(string | JSX.Element)[]>([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(true);
  const { extendedStatus, session } = useExtendedStatus();
  const router = useRouter();
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    const focusInput = () => {
      if (!isInputFocused) {
        inputRef.current?.focus();
        setIsInputFocused(true);
      }
    };

    focusInput();

    document.addEventListener('keydown', focusInput);
    window.addEventListener('focus', focusInput);
    
    return () => {
      document.removeEventListener('keydown', focusInput);
      window.removeEventListener('focus', focusInput);
    };
  }, [isInputFocused]);

  useEffect(() => {
    if (inputRef.current) {
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [inputCmd]);

  const handleTerminalClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!window.getSelection()?.toString()) {
      inputRef.current?.focus();
      setIsInputFocused(true);
    }
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsInputFocused(false);
  }, []);

  const executeCommand = useCallback(async (command: string) => {
    const response = await fetch('/api/cmd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cmd: command }),
    });

    if (!response.ok) {
      throw new Error('Command not found');
    }

    return await response.json();
  }, []);

  const handleKeyDown = useCallback(async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isMac = navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;

    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedCmd = inputCmd.trim();

      if (trimmedCmd) {
        setCmdHistory((prev) => [...prev, trimmedCmd]);
        setHistoryIndex(null);

        if (trimmedCmd.toLowerCase() === 'clear') {
          setOutput([]);
        } else if (trimmedCmd.toLowerCase() === 'exit') {
          window.close();
        } else if (trimmedCmd.toLowerCase() === 'status') {
          setOutput((prev) => [...prev,
          <div key={prev.length}>
            {renderPrompt()}
            <span className="text-white ml-1">{trimmedCmd}</span>:
            <div>Opening video...</div>
          </div>
          ]);
          window.open('https://www.youtube.com/watch?v=bIXm-Q-Xa4s', '_blank');
        } else {
          try {
            const data = await executeCommand(trimmedCmd);
            
            setOutput((prev) => [
              ...prev,
              <div key={prev.length}>
                {renderPrompt()}
                <span className="text-white ml-1">{trimmedCmd}</span>:
              </div>,
              ...renderOutput(data)
            ]);
          } catch (error) {
            setOutput((prev) => [
              ...prev,
              <div key={prev.length}>
                {renderPrompt()}
                <span className="text-white ml-1">{trimmedCmd}</span>:
                <div>Command not found</div>
              </div>
            ]);
          }
        }
        setInputCmd('');
      }
    } else if (e.key === 'ArrowUp') {
      if (historyIndex === null && cmdHistory.length > 0) {
        setHistoryIndex(cmdHistory.length - 1);
        setInputCmd(cmdHistory[cmdHistory.length - 1]);
      } else if (historyIndex !== null && historyIndex > 0) {
        setHistoryIndex(historyIndex - 1);
        setInputCmd(cmdHistory[historyIndex - 1]);
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex !== null) {
        if (historyIndex < cmdHistory.length - 1) {
          setHistoryIndex(historyIndex + 1);
          setInputCmd(cmdHistory[historyIndex + 1]);
        } else {
          setHistoryIndex(null);
          setInputCmd('');
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const matches = cmdHistory.filter(cmd => cmd.startsWith(inputCmd));
      if (matches.length === 1) {
        setInputCmd(matches[0]);
      } else if (matches.length > 1) {
        setOutput((prev) => [
          ...prev,
          <div key={prev.length}>
            {renderPrompt()}
            <span className="text-white ml-1">{inputCmd}</span>:
            <div>{matches.join('  ')}</div>
          </div>
        ]);
      }
    } else if ((e.key.toLowerCase() === 'l' && e.ctrlKey)
      || (e.key.toLowerCase() === 'c' && e.ctrlKey)
      || (e.key.toLowerCase() === 'k' && (isMac ? e.metaKey : e.ctrlKey))) {
      e.preventDefault();
      setOutput([]);
    }
  }, [inputCmd, cmdHistory, historyIndex, executeCommand]);

  return (
    <div 
      className="bg-[#2d2d2d] h-screen overflow-hidden font-Space_Grotesk text-white flex flex-col" 
      ref={terminalRef} 
      onClick={handleTerminalClick}
    >
      <div 
        ref={outputRef}
        className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-[#2d2d2d]"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#4A5568 #2d2d2d',
          msOverflowStyle: 'none',
        }}
      >
        <style jsx global>{`
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-track {
            background: #2d2d2d;
          }
          ::-webkit-scrollbar-thumb {
            background: #4A5568;
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #718096;
          }
        `}</style>
        <div className="whitespace-pre-wrap break-words">
          {output.map((line, index) => (
            <div key={index} className="mb-2">
              {line}
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center">
          {renderPrompt()}
          <input
            ref={inputRef}
            type="text"
            className="bg-[#2d2d2d] text-white text-xl border-none outline-none flex-1 ml-2"
            value={inputCmd}
            onChange={(e) => setInputCmd(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleInputBlur}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;