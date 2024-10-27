import { signOut } from 'next-auth/react';
import React, { useState } from 'react';
import { BsBank } from 'react-icons/bs';
import { FaUser, FaSignOutAlt, FaCreditCard, FaHistory } from 'react-icons/fa';
import { IoSettingsSharp } from "react-icons/io5";
import { MdDashboard, MdPayments, MdAccountBalance } from "react-icons/md";

const SideNav = () => {
    const [showBackDrop, setShowBackDrop] = useState(false);
    const [activeItem, setActiveItem] = useState('dashboard');

    const handleSignOut = () => {
        setShowBackDrop(true);
        signOut({ callbackUrl: "/" });
    }

    const navItems = [
        { id: 'dashboard', icon: MdDashboard, label: 'Dashboard' },
        { id: 'profile', icon: FaUser, label: 'Profile' },
        { id: 'transactions', icon: FaHistory, label: 'Transactions' },
        { id: 'cards', icon: FaCreditCard, label: 'Cards' },
        { id: 'payments', icon: MdPayments, label: 'Payments' },
        { id: 'accounts', icon: MdAccountBalance, label: 'Accounts' },
    ];

    return (
        <div className="flex flex-col h-screen bg-[#1a1b26] w-[240px] py-6">
            {/* Logo/Brand Section */}
            <div className="mb-8 px-6 relative group mb-5">
                <div className="flex items-center justify-center relative">
                    <span className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-lg font-semibold">
                        <BsBank />
                    </span>
                </div>
            </div>


            {/* Main Navigation Items */}
            <div className="flex-grow space-y-1 px-3">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveItem(item.id)}
                        // onMouse
                        className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200
                            ${activeItem === item.id
                                ? 'bg-[#2a2b36] text-white'
                                : 'text-gray-400 hover:bg-[#2a2b36] hover:text-white'}`}
                    >
                        <item.icon className="text-xl" />
                        {/* <span className="ml-3 text-sm font-medium">
                            {item.label}
                        </span> */} {/*//hadi 9adha rdha onHover iban that text*/}
                    </button>
                ))}
            </div>

            {/* Bottom Section - Settings and Logout */}
            <div className="pt-4 border-t border-gray-700 space-y-1 px-3">
                <button
                    className="w-full flex items-center px-3 py-3 text-gray-400 hover:bg-[#2a2b36] hover:text-white rounded-lg transition-all duration-200"
                >
                    <IoSettingsSharp className="text-xl" />
                    <span className="ml-3 text-sm font-medium">
                        Settings
                    </span>
                </button>

                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center px-3 py-3 text-gray-400 hover:bg-[#2a2b36] hover:text-white rounded-lg transition-all duration-200"
                >
                    <FaSignOutAlt className="text-xl" />
                    <span className="ml-3 text-sm font-medium">
                        Logout
                    </span>
                </button>
            </div>

            {/* Backdrop for logout */}
            {showBackDrop && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <p className="text-gray-800">Signing out...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SideNav;