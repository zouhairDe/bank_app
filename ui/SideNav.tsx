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
    Shield,
    Home,
    BarChart3,
    HelpCircle,
    Menu
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRiveState } from "@/context/RiveContext";
import { useExtendedStatus } from '@/hooks/useExtendedStatus';

const SideNav = () => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { setRiveState } = useRiveState();
    const { session } = useExtendedStatus();

    const mainNavItems = [
        { id: "dashboard", icon: Home, label: "Dashboard", href: "/Home" },
        { id: "cards", icon: CreditCard, label: "Cards" },
        { id: "transactions", icon: History, label: "Transactions" },
        { id: "analytics", icon: BarChart3, label: "Analytics" },
        { id: "wallet", icon: Wallet, label: "Wallet" },
    ];

    const bottomNavItems = [
        { id: "settings", icon: Settings, label: "Settings", action: () => setIsSettingsOpen(true) },
        { id: "help", icon: HelpCircle, label: "Help & Support" },
        { id: "logout", icon: LogOut, label: "Sign Out", action: () => handleSignOut() },
    ];

    const handleSignOut = async () => {
        setRiveState(["Face to error", "Loop"]);
        await signOut({ callbackUrl: "/" });
    };

    return (
        <>
            <div className={`h-full flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
                {/* Header */}
                <div className="p-6 border-b border-slate-700/50">
                    <div className="flex items-center justify-between">
                        {!isCollapsed && (
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-lg font-bold text-white">SecureBank</span>
                            </div>
                        )}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors lg:hidden"
                        >
                            <Menu className="w-4 h-4 text-slate-300" />
                        </button>
                    </div>
                </div>

                {/* User Profile */}
                <div className="p-6 border-b border-slate-700/50">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <img
                                src={session?.user?.image || "/default-avatar.png"}
                                alt="Profile"
                                className="w-10 h-10 rounded-xl object-cover border-2 border-blue-500/30"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">
                                    {session?.user?.name || 'User'}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                    {session?.user?.email || 'user@example.com'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Navigation */}
                <div className="flex-1 px-4 py-6">
                    <div className="space-y-2">
                        {mainNavItems.map((item) => (
                            <button
                                key={item.id}
                                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                                    item.id === "dashboard"
                                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-blue-300'
                                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                                }`}
                            >
                                <item.icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'} ${
                                    item.id === "dashboard" ? 'text-blue-400' : 'group-hover:text-blue-400'
                                }`} />
                                {!isCollapsed && (
                                    <span className="text-sm font-medium">{item.label}</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {!isCollapsed && (
                        <div className="mt-8">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-4">
                                Quick Actions
                            </p>
                            <div className="space-y-2">
                                <button className="w-full flex items-center px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors">
                                    <CreditCard className="w-4 h-4 mr-3" />
                                    Request New Card
                                </button>
                                <button className="w-full flex items-center px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors">
                                    <Banknote className="w-4 h-4 mr-3" />
                                    Transfer Money
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Navigation */}
                <div className="p-4 border-t border-slate-700/50">
                    <div className="space-y-1">
                        {bottomNavItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={item.action}
                                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                                    item.id === "logout"
                                        ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                }`}
                            >
                                <item.icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                                {!isCollapsed && (
                                    <span className="text-sm font-medium">{item.label}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Settings Modal */}
            {isSettingsOpen && (
                <SettingsModal 
                    isOpen={isSettingsOpen} 
                    onClose={() => setIsSettingsOpen(false)} 
                />
            )}
        </>
    );
};

// Settings Modal Component
const SettingsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const settingsItems = [
        { id: "personal", icon: User, label: "Personal Information" },
        { id: "security", icon: Shield, label: "Security & Privacy" },
        { id: "preferences", icon: Settings, label: "Preferences" },
    ];
    const [activeSettingItem, setActiveSettingItem] = useState(settingsItems[0].id);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-slate-800/90 backdrop-blur-lg border border-slate-700/50 rounded-2xl w-full max-w-4xl h-[80vh] shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex h-full">
                    {/* Settings Sidebar */}
                    <div className="w-80 bg-slate-900/50 border-r border-slate-700/50 p-6 rounded-l-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-white">Settings</h2>
                            <button 
                                onClick={onClose}
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="space-y-2">
                            {settingsItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSettingItem(item.id)}
                                    className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-left
                                        ${activeSettingItem === item.id
                                            ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-blue-300'
                                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Settings Content */}
                    <div className="flex-1 p-8 overflow-y-auto">
                        {activeSettingItem === "personal" && (
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Personal Information</h3>
                                    <p className="text-slate-400 text-sm mb-6">Manage your personal details and contact information.</p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                                        <input 
                                            type="email" 
                                            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Date of Birth</label>
                                        <input 
                                            type="date" 
                                            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSettingItem === "security" && (
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Security & Privacy</h3>
                                    <p className="text-slate-400 text-sm mb-6">Manage your account security and privacy settings.</p>
                                </div>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
                                        <input 
                                            type="password" 
                                            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                                        <input 
                                            type="password" 
                                            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label>
                                        <input 
                                            type="password" 
                                            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSettingItem === "preferences" && (
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Preferences</h3>
                                    <p className="text-slate-400 text-sm mb-6">Customize your banking experience.</p>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                                        <div>
                                            <h4 className="text-sm font-medium text-white">Email Notifications</h4>
                                            <p className="text-xs text-slate-400">Receive transaction alerts via email</p>
                                        </div>
                                        <div className="relative">
                                            <input type="checkbox" className="sr-only" />
                                            <div className="w-10 h-6 bg-slate-600 rounded-full cursor-pointer"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                                        <div>
                                            <h4 className="text-sm font-medium text-white">SMS Notifications</h4>
                                            <p className="text-xs text-slate-400">Receive transaction alerts via SMS</p>
                                        </div>
                                        <div className="relative">
                                            <input type="checkbox" className="sr-only" />
                                            <div className="w-10 h-6 bg-slate-600 rounded-full cursor-pointer"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="flex justify-end mt-8 pt-6 border-t border-slate-700/50">
                            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SideNav;