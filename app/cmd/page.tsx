"use client";

import { notFound } from 'next/navigation';
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
    const users = data.message.users;
    users.forEach((user: User) => {
      const userCards = data.message?.cards || [];
      const userTransactions = data.message?.transactions || [];

      const userDetails = (
        <div className="flex flex-col flex-1">
          <div><strong>Name:</strong> {user.name}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Password:</strong> {user.password}</div>
          <div><strong>Role:</strong> {user.role}</div>
          <div><strong>Phone Number:</strong> {user.phoneNumber}</div>
          <div><strong>Image:</strong> <img src={user.image} alt="User Image" className="h-16 w-16 rounded-full" /></div>
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

      const cardsSection = (
        <div className="flex flex-col flex-1">
          <h4 className="text-lg font-semibold mb-2">Cards</h4>
          {userCards.map((card: Card) => (
            <div key={card.id} className="mb-4">
              <div><strong>Card Number:</strong> {card.number}</div>
              <div><strong>Card Type:</strong> {card.type}</div>
              <div><strong>Expiry Date:</strong> {new Date(card.expiryDate).toLocaleString()}</div>
              <div><strong>Status:</strong> {card.status}</div>
            </div>
          ))}
        </div>
      );

      const transactionsSection = (
        <div className="flex flex-col flex-1">
          <h4 className="text-lg font-semibold mb-2">Transactions</h4>
          {renderTransactions(userTransactions)}
        </div>
      );

      const combinedContent = (
        <div className="flex flex-row space-x-4">
          {userDetails}
          {cardsSection}
          {transactionsSection}
        </div>
      );

      outputElements.push(
        <Card
          key={user.email}
          title={`User Profile - ${user.name}`}
          content={combinedContent}
        />
      );
    });
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

  // Enhanced focus management
  useEffect(() => {
    const focusInput = () => {
      if (!isInputFocused) {
        inputRef.current?.focus();
        setIsInputFocused(true);
      }
    };

    // Focus input on mount
    focusInput();

    // Add global event listeners
    document.addEventListener('keydown', focusInput);
    window.addEventListener('focus', focusInput);
    
    // Cleanup listeners
    return () => {
      document.removeEventListener('keydown', focusInput);
      window.removeEventListener('focus', focusInput);
    };
  }, [isInputFocused]);

  // Handle cursor position
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
      className="bg-[#2d2d2d] min-h-screen font-Space_Grotesk text-white" 
      ref={terminalRef} 
      onClick={handleTerminalClick}
    >
      <div className="p-4">
        <div className="whitespace-pre-wrap break-words">
          {output.map((line, index) => (
            <div key={index} className="mb-2">
              {line}
            </div>
          ))}
        </div>
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