"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "@/ui/Loading";
import RiveDownloadLoader from "@/ui/RiveDownloadLoader";
import { useExtendedStatus } from '@/hooks/useExtendedStatus';
import TransactionForm from "./TransactionForm";
import TransactionHistory from "./TransactionHistory";
import { useRiveState } from "@/context/RiveContext";

const Home = () => {
    const { extendedStatus, session } = useExtendedStatus();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [toastId, setToastId] = useState<string | null>(null);
    const { setRiveState } = useRiveState();
    const [creditCards, setCreditCards] = useState(session?.user?.creditCards || []);
    const [userBalance, setUserBalance] = useState(session?.user?.balance || 0);
    const [showRiveLoader, setShowRiveLoader] = useState(false);

    useEffect(() => {
        if (session?.user) {
            setCreditCards(session.user.creditCards || []);
            setUserBalance(session.user.balance || 0);
        }
    }, [session]);

    const getCreditCardsLength = () => creditCards.length;
    const updateLocalState = (newData: { creditCards?: any[]; balance?: number }) => {
        if (newData.creditCards) {
            setCreditCards(newData.creditCards);
        }
        if (newData.balance !== undefined) {
            setUserBalance(newData.balance);
        }
    };

    const AddCreditCard = async () => {
        if (isLoading || (toastId && toast.isActive(toastId))) return;
        
        // Show Rive download loader
        setShowRiveLoader(true);
        setIsLoading(true);

        // Don't show toast immediately, let the loader handle the UI
        toast.dismiss();

        try {
            const response = await fetch('/api/create-cards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: session?.user?.id }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create credit card');
            }

            // Update local state with new credit card
            updateLocalState({
                creditCards: [...creditCards, data.creditCard]
            });

            // Soft refresh router cache without page reload
            router.refresh();

        } catch (error: any) {
            // Hide loader and show error
            setShowRiveLoader(false);
            setIsLoading(false);
            
            const errorToastId = toast.error(error.message || 'Failed to create credit card', {
                position: "top-right",
                autoClose: 3000
            });
            setToastId(errorToastId as string);
            
            console.error('Failed to create cards:', error);
        }
        // Note: Success handling is now done in handleRiveLoaderComplete
    };

    const handleRiveLoaderComplete = () => {
        setShowRiveLoader(false);
        setIsLoading(false);
        
        // Show success toast
        const successToastId = toast.success("Credit card created successfully!", {
            position: "top-right",
            autoClose: 3000
        });
        setToastId(successToastId as string);
    };

    const FatMan = async () => {
        if (isLoading || (toastId && toast.isActive(toastId))) return;
        if (!confirm("Are you sure you want to delete all users? This action cannot be undone.")) {
            return;
        }

        setIsLoading(true);

        toast.dismiss();
        const newToastId = toast.loading("Deleting users...", {
            position: "top-right"
        });
        setToastId(newToastId as string);

        try {
            const response = await fetch('/api/delete-users', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete users');
            }

            toast.update(newToastId, {
                render: "Users deleted successfully",
                type: "success",
                isLoading: false,
                autoClose: 2000
            });

            // Soft refresh router cache without page reload
            router.refresh();

        } catch (error: any) {
            toast.update(newToastId, {
                render: error.message || 'Failed to delete users',
                type: "error",
                isLoading: false,
                autoClose: 2000
            });
            console.error('Failed to delete users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const Listtheusers = async () => {
        if (isLoading || (toastId && toast.isActive(toastId))) return;
        setIsLoading(true);

        toast.dismiss();
        const newToastId = toast.loading("Fetching users list...", {
            position: "top-right"
        });
        setToastId(newToastId as string);

        try {
            setRiveState(["Face to chat", "Loop"]);
            const response = await fetch('/api/list-users', {
                method: 'GET',
            });

            if (!response.ok) {
                setRiveState(["Face to error", "Loop"]);
                throw new Error('Failed to fetch users list');
            }

            const data = await response.json();
            setRiveState(["Face Idle", "Loop"]);
            toast.update(newToastId, {
                render: "Users list fetched successfully",
                type: "success",
                isLoading: false,
                autoClose: 2000
            });
            console.log(data.message);
        } catch (error: any) {
            setRiveState(["Face to error", "Loop"]);
            toast.update(newToastId, {
                render: error.message || 'Failed to fetch users list',
                type: "error",
                isLoading: false,
                autoClose: 2000
            });
            console.error('Failed to list users:', error);
        } finally {
            setRiveState(["Face Idle", "Loop"]);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        switch (extendedStatus) {
            case "unauthenticated":
                router.push("/");
                break;
            case "unverified":
                router.push("/verify-email");
                break;
            case "banned":
                router.push("/banned");
                break;
            case "incomplete":
                router.push("/complete-profile");
                break;
        }
    }, [extendedStatus, router]);

    if (extendedStatus === "loading" || isLoading) {
        return <Loading />;
    }

    // Handle authentication and banned states
    switch (extendedStatus) {
        case "unauthenticated":
        case "banned":
            return (
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center shadow-2xl">
                        <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-red-200 mb-2">
                            Account {extendedStatus === "banned" ? "Banned" : "Unauthorized"}
                        </h1>
                        <p className="text-slate-400 mb-6">
                            {extendedStatus === "banned" 
                                ? "Your account has been suspended. Please contact support for assistance."
                                : "You need to be authenticated to access this page."
                            }
                        </p>
                        <button 
                            onClick={() => router.push("/")}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Go to Login
                        </button>
                    </div>
                </div>
            );
        case "incomplete":
            return null; // Handled by useEffect redirect
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                limit={1}
                style={{ zIndex: 9999 }}
            />

            {/* Header Navigation */}
            <header className="bg-slate-900/70 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <h1 className="text-xl font-bold">SecureBank</h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-slate-300">
                                <span className="hidden sm:inline">Status: </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {extendedStatus}
                                </span>
                            </div>
                            <div className="text-sm text-slate-400 hidden md:block">
                                Last login: {session?.user?.updatedAt && new Date(session.user.updatedAt).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Debug Admin Panel */}
            {(session?.user?.role === 'ADMIN') && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 backdrop-blur-sm border border-red-700/50 rounded-xl p-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <h2 className="text-lg font-semibold text-red-200">Admin Debug Panel</h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={FatMan}
                                disabled={isLoading}
                                className="inline-flex items-center px-4 py-2 border border-red-600 text-sm font-medium rounded-lg text-red-200 bg-red-900/30 hover:bg-red-800/40 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                {isLoading ? 'Processing...' : 'Delete All Users'}
                            </button>
                            <button
                                onClick={Listtheusers}
                                disabled={isLoading}
                                className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-lg text-blue-200 bg-blue-900/30 hover:bg-blue-800/40 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {isLoading ? 'Loading...' : 'List All Users'}
                            </button>
                            <button
                                onClick={() => window.open('/cmd')}
                                disabled={isLoading}
                                className="inline-flex items-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-lg text-slate-200 bg-slate-800/30 hover:bg-slate-700/40 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Terminal Session
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-none">
                {/* Welcome Section */}
                <div className="mb-8 max-w-7xl mx-auto">
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <Image
                                        src={session?.user?.image || "/default-avatar.png"}
                                        alt="Profile"
                                        width={80}
                                        height={80}
                                        className="h-20 w-20 rounded-2xl object-cover border-2 border-blue-500/30"
                                    />
                                    <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 border-2 border-slate-800 rounded-full"></div>
                                </div>
                            </div>
                            <div className="flex-grow">
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                    Welcome back, {session?.user?.gender === "Male" ? "Mr." : "Ms."} {session?.user?.name?.split(' ')[0] || 'User'}
                                </h1>
                                <p className="text-slate-400 mt-1 text-lg">
                                    {session?.user?.email || 'No email available'}
                                </p>
                                <div className="flex items-center space-x-4 mt-3">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100/10 text-blue-300 border border-blue-500/20">
                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Verified Account
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 max-w-7xl mx-auto">
                    {/* Balance Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-blue-100">Available Balance</h2>
                                    <svg className="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <p className="text-4xl font-bold mb-2">
                                    ${userBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                <p className="text-blue-200 text-sm">
                                    Updated {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium">Active Cards</p>
                                    <p className="text-2xl font-bold mt-1">{creditCards.filter(card => !card.isBlocked).length}</p>
                                </div>
                                <div className="p-3 bg-green-500/20 rounded-lg">
                                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium">Total Cards</p>
                                    <p className="text-2xl font-bold mt-1">{creditCards.length}</p>
                                </div>
                                <div className="p-3 bg-blue-500/20 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Credit Cards Section */}
                <div className="mb-8 max-w-7xl mx-auto">
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold">Your Credit Cards</h2>
                            {getCreditCardsLength() < 3 && (
                                <button
                                    onClick={AddCreditCard}
                                    disabled={isLoading}
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    {isLoading ? 'Creating...' : 'Add New Card'}
                                </button>
                            )}
                        </div>
                        
                        {creditCards.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {creditCards.map((card, index) => (
                                    card && (
                                        <div
                                            key={card.id}
                                            className={`relative p-6 rounded-2xl text-white shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                                                index % 3 === 0 ? 'bg-gradient-to-br from-slate-700 to-slate-900' :
                                                index % 3 === 1 ? 'bg-gradient-to-br from-blue-600 to-blue-800' :
                                                'bg-gradient-to-br from-purple-600 to-purple-800'
                                            }`}
                                        >
                                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
                                            <div className="relative z-10">
                                                <div className="flex justify-between items-start mb-8">
                                                    <div>
                                                        <p className="text-white/70 text-sm font-medium">CREDIT CARD</p>
                                                        <p className="text-xl font-bold mt-1">{card.holder}</p>
                                                    </div>
                                                    <div className="p-2 bg-white/20 rounded-lg">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="mb-6">
                                                    <p className="text-2xl font-mono tracking-wider">
                                                        **** **** **** {card.number.slice(-4)}
                                                    </p>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-white/70 text-xs">EXPIRES</p>
                                                        <p className="text-sm font-semibold">
                                                            {new Date(card.expirationDate).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' })}
                                                        </p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                        card.isBlocked 
                                                            ? 'bg-red-500/20 text-red-200 border border-red-400/30' 
                                                            : 'bg-green-500/20 text-green-200 border border-green-400/30'
                                                    }`}>
                                                        {card.isBlocked ? "Blocked" : "Active"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="mx-auto w-24 h-24 bg-slate-700/50 rounded-2xl flex items-center justify-center mb-6">
                                    <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-slate-300 mb-2">No Credit Cards</h3>
                                <p className="text-slate-400 mb-6">
                                    You have no credit cards on file. Add your first card to get started.
                                </p>
                                <button
                                    onClick={AddCreditCard}
                                    disabled={isLoading}
                                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    {isLoading ? 'Creating...' : 'Add Your First Credit Card'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Transactions Section - Full Width Below Credit Cards */}
                <div className="mb-8">
                    {/* Section Header */}
                    <div className="max-w-7xl mx-auto mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                Recent Activity & Transactions
                            </h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                        </div>
                        <p className="text-slate-400 mt-2 text-lg">Manage your money and view transaction history</p>
                    </div>

                    {/* Transactions Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Transaction History - Takes up 3/4 of the width */}
                        <div className="lg:col-span-3">
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl h-full">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Transaction History</h3>
                                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100/10 text-emerald-300 border border-emerald-500/20">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                                        Live Updates
                                    </div>
                                </div>
                                <TransactionHistory />
                            </div>
                        </div>

                        {/* Transaction Form - Takes up 1/4 of the width */}
                        <div className="lg:col-span-1">
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl h-full">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Send Money</h3>
                                </div>
                                <TransactionForm onTransactionComplete={(newBalance) => setUserBalance(newBalance)} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Rive Download Loader */}
            <RiveDownloadLoader
                isVisible={showRiveLoader}
                onComplete={handleRiveLoaderComplete}
                title="Creating Credit Card"
                subtitle="Please wait while we generate your new credit card..."
            />
        </div>
    );
};

export default Home;