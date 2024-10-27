import React, { useState } from 'react';
import {
    User,
    LogOut,
    CreditCard,
    History,
    Settings,
    Building2,
    Wallet,
    Banknote,
    X,
    Shield
} from 'lucide-react';
import { signOut } from 'next-auth/react';

// Separate Settings Component
const SettingsModal = ({ isOpen, onClose }) => {
    const settingsItems = [
        { id: "Personal Information", icon: User, label: "Personal Information" },
        { id: "change password", icon: Settings, label: "Change Password" },
        { id: "Data&Privacy", icon: Shield, label: "Data & Privacy" },
    ];
    const [activeSettingItem, setActiveSettingItem] = useState(settingsItems[0].id);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-[#1a1b26] rounded-lg w-[80%] h-[80%] p-6 relative" onClick={e => e.stopPropagation()}>
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>
                
                <div className="flex h-full gap-6">
                    {/* Left sidebar */}
                    <div className="w-64 border-r border-gray-700">
                        <h2 className="text-xl font-bold text-white mb-6">Settings</h2>
                        <div className="space-y-2">
                            {settingsItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSettingItem(item.id)}
                                    className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 text-left
                                        ${activeSettingItem === item.id
                                            ? 'bg-[#2a2b36] text-white'
                                            : 'text-gray-400 hover:bg-[#2a2b36] hover:text-white'}`}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right content area */}
                    <div className="flex-1 text-white">
                        {activeSettingItem === "Personal Information" && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold">Personal Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Name</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-[#2a2b36] rounded-lg px-4 py-2 text-white"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Email</label>
                                        <input 
                                            type="email" 
                                            className="w-full bg-[#2a2b36] rounded-lg px-4 py-2 text-white"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSettingItem === "change password" && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold">Change Password</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Current Password</label>
                                        <input 
                                            type="password" 
                                            className="w-full bg-[#2a2b36] rounded-lg px-4 py-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">New Password</label>
                                        <input 
                                            type="password" 
                                            className="w-full bg-[#2a2b36] rounded-lg px-4 py-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                                        <input 
                                            type="password" 
                                            className="w-full bg-[#2a2b36] rounded-lg px-4 py-2 text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSettingItem === "Data&Privacy" && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold">Data & Privacy</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">Enable notifications</label>
                                        <input type="checkbox" className="h-4 w-4" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">Share usage data</label>
                                        <input type="checkbox" className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SideNav = () => {
    const [showBackDrop, setShowBackDrop] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [activeItem, setActiveItem] = useState('profile');

    const handleSignOut = () => {
        setShowBackDrop(true);
        setTimeout(() => {
            signOut({ callbackUrl: '/' });
            console.log('Signing out...');
        }, 1000);
    };

    const navItems = [
        { id: 'profile', icon: User, label: 'Profile' },
        { id: 'transactions', icon: History, label: 'Transactions' },
        { id: 'cards', icon: CreditCard, label: 'Cards' },
        { id: 'payments', icon: Wallet, label: 'Payments' },
        { id: 'accounts', icon: Banknote, label: 'Accounts' },
    ];

    return (
        <>
            <div className="flex flex-col h-screen bg-[#1a1b26] w-[240px] py-6 items-center">
                <div className="px-6 relative group mt-4 mb-4 text-white text-xl">
                    <div className="flex items-center justify-center text-xl relative font-bold">
                        <span className="flex items-center px-3 py-3 rounded-lg transition-all duration-200 text-lg font-bold">
                            <Building2 className="font-bold" />
                        </span>
                        <h1>69-Bank</h1>
                    </div>
                </div>

                <div className="flex-grow w-full space-y-1 px-3 text-xl font-bold">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveItem(item.id)}
                            className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 text-xl gap-4 font-bold
                                ${activeItem === item.id
                                    ? 'bg-[#2a2b36] text-white'
                                    : 'text-gray-400 hover:bg-[#2a2b36] hover:text-white'}`}
                        >
                            <item.icon className="w-6 h-6" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>

                <div className="w-full pt-4 border-t border-gray-700 space-y-1 px-3">
                    <button
                        onClick={() => setShowSettings(true)}
                        className="w-full flex items-center px-3 py-3 text-gray-400 hover:bg-[#2a2b36] hover:text-white rounded-lg transition-all duration-200"
                    >
                        <Settings className="w-6 h-6 mr-2" />
                        <span className="ml-3 text-sm font-medium">Settings</span>
                    </button>

                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center px-3 py-3 text-gray-400 hover:bg-[#2a2b36] hover:text-white rounded-lg transition-all duration-200"
                    >
                        <LogOut className="w-6 h-6 mr-2" />
                        <span className="ml-3 text-sm font-medium">Logout</span>
                    </button>
                </div>
            </div>

            {showBackDrop && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <p className="text-gray-800">Signing out...</p>
                    </div>
                </div>
            )}

            <SettingsModal 
                isOpen={showSettings} 
                onClose={() => setShowSettings(false)} 
            />
        </>
    );
};

export default SideNav;