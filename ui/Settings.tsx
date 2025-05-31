"use client";

import React, { useEffect, useState } from "react";
import { useExtendedStatus } from "@/hooks/useExtendedStatus";
import {
    LanguagesIcon,
    User,
    Lock,
    Shield,
    LogOut,
    Settings as SettingsIcon
} from "lucide-react";
import { signOut } from "next-auth/react";

const SettingsComponent = () => {
    const [showBackDrop, setShowBackDrop] = useState(false);
    const [activeItem, setActiveItem] = useState("Personal Information");

    const { extendedStatus, session } = useExtendedStatus();
    
    const settingsItems = [
        { id: "Personal Information", icon: User, label: "Personal Information" },
        { id: "change password", icon: Lock, label: "Change Password" },
        { id: "Data&Privacy", icon: Shield, label: "Data & Privacy" },
    ];

    const handleSignOut = () => {
        setShowBackDrop(true);
        setTimeout(() => {
            signOut({ callbackUrl: "/" });
            console.log("Signing out...");
        }, 1000);
    };

    const renderContent = () => {
        switch (activeItem) {
            case "Personal Information":
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                <input 
                                    type="text" 
                                    value={session?.user?.name || ""} 
                                    disabled
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white disabled:opacity-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                <input 
                                    type="email" 
                                    value={session?.user?.email || ""} 
                                    disabled
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white disabled:opacity-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Account Status</label>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                                    session?.user?.isVerified ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                }`}>
                                    {session?.user?.isVerified ? 'Verified' : 'Not Verified'}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            case "change password":
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Change Password</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                                <input 
                                    type="password" 
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                                <input 
                                    type="password" 
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors">
                                Update Password
                            </button>
                        </div>
                    </div>
                );
            case "Data&Privacy":
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Data & Privacy</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-700/50 rounded-lg">
                                <h4 className="font-medium text-white mb-2">Data Collection</h4>
                                <p className="text-gray-300 text-sm">We collect minimal data necessary for banking operations.</p>
                            </div>
                            <div className="p-4 bg-gray-700/50 rounded-lg">
                                <h4 className="font-medium text-white mb-2">Data Sharing</h4>
                                <p className="text-gray-300 text-sm">Your data is never shared with third parties without consent.</p>
                            </div>
                            <div className="p-4 bg-gray-700/50 rounded-lg">
                                <h4 className="font-medium text-white mb-2">Data Retention</h4>
                                <p className="text-gray-300 text-sm">Transaction data is retained for regulatory compliance.</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {/* Main Settings Container - Centered on screen */}
            <div className="fixed inset-0 bg-gray-900 flex items-center justify-center p-4">
                <div className="w-full max-w-6xl h-full max-h-[90vh] bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-700 p-6 border-b border-gray-600">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <SettingsIcon className="w-6 h-6 text-blue-400" />
                                <h1 className="text-2xl font-bold text-white">Settings</h1>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex h-full">
                        {/* Left Sidebar - Settings Menu */}
                        <div className="w-1/3 bg-gray-750 border-r border-gray-600 p-6">
                            <div className="space-y-2">
                                {settingsItems.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveItem(item.id)}
                                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left ${
                                                activeItem === item.id
                                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                            }`}
                                        >
                                            <IconComponent className="w-5 h-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Content Area */}
                        <div className="flex-1 p-6 overflow-y-auto">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading Backdrop */}
            {showBackDrop && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                        <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                            <span className="text-white">Signing out...</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SettingsComponent;