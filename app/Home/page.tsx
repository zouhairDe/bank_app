"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "@/ui/Loading";
import { useExtendedStatus } from '@/hooks/useExtendedStatus';
import TransactionForm from "./TransactionForm";

const Home = () => {
    const { extendedStatus, session } = useExtendedStatus();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [toastId, setToastId] = useState(null);

    const getCreditCardsLength = () => {
        return session?.user?.creditCards?.length || 0;
    };

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const AddCreditCard = async () => {
        if (isLoading || toast.isActive(toastId)) return;
        setIsLoading(true);

        toast.dismiss();
        const newToastId = toast.loading("Creating credit card...", {
            position: "top-right"
        });
        setToastId(newToastId);

        try {
            // setState(["Face to chat", "Loop"]);
            const response = await fetch('/api/create-cards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: session?.user?.id }),
            });

            const data = await response.json();

            if (!response.ok) {
                // setState(["Face to error", "Loop"]);
                throw new Error(data.message || 'Failed to create credit card');
            }

            // setState(["Face Idle", "Loop"]);
            toast.update(newToastId, {
                render: "Credit card created successfully!",
                type: "success",
                isLoading: false,
                autoClose: 2000
            });

            await wait(1000);
            router.refresh();

            setTimeout(() => {
                window.location.reload();
            }, 100);

            return data;
        } catch (error: any) {
            // setState(["Face to error", "Loop"]);
            toast.update(newToastId, {
                render: error.message || 'Failed to create credit card',
                type: "error",
                isLoading: false,
                autoClose: 2000
            });
            console.error('Failed to create cards:', error);
        } finally {
            setIsLoading(false);
            // setState(["Face Idle", "Loop"]);
        }
    };

    const FatMan = async () => {
        if (isLoading || toast.isActive(toastId)) return;
        if (!confirm("Are you sure you want to delete all users? This action cannot be undone.")) {
            return;
        }

        setIsLoading(true);

        toast.dismiss();
        const newToastId = toast.loading("Deleting users...", {
            position: "top-right"
        });
        setToastId(newToastId);

        try {
            // setState(["Face to chat", "Loop"]);
            const response = await fetch('/api/delete-users', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                // setState(["Face to error", "Loop"]);
                throw new Error(data.message || 'Failed to delete users');
            }

            // setState(["Face Idle", "Loop"]);
            toast.update(newToastId, {
                render: "Users deleted successfully",
                type: "success",
                isLoading: false,
                autoClose: 2000
            });
            console.log('Successfully deleted:', data.message);
            return data;
        } catch (error: any) {
            // setState(["Face to error", "Loop"]);    
            toast.update(newToastId, {
                render: error.message || 'Failed to delete users',
                type: "error",
                isLoading: false,
                autoClose: 2000
            });
            console.error('Failed to delete users:', error);
        } finally {
            setIsLoading(false);
            // setState(["Face Idle", "Loop"]);
        }
    };

    const Listtheusers = async () => {
        if (isLoading || toast.isActive(toastId)) return;
        setIsLoading(true);

        toast.dismiss();
        const newToastId = toast.loading("Fetching users list...", {
            position: "top-right"
        });
        setToastId(newToastId);

        try {
            // setState(["Face to chat", "Loop"]);
            const response = await fetch('/api/list-users', {
                method: 'GET',
            });

            if (!response.ok) {
                // setState(["Face to error", "Loop"]);
                throw new Error('Failed to fetch users list');
            }

            const data = await response.json();
            // setState(["Face Idle", "Loop"]);
            toast.update(newToastId, {
                render: "Users list fetched successfully",
                type: "success",
                isLoading: false,
                autoClose: 2000
            });
            console.log(data.message);
        } catch (error: any) {
            // setState(["Face to error", "Loop"]);
            toast.update(newToastId, {
                render: error.message || 'Failed to fetch users list',
                type: "error",
                isLoading: false,
                autoClose: 2000
            });
            console.error('Failed to list users:', error);
        } finally {
            // setState(["Face Idle", "Loop"]);
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
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center text-red-500">
                        <h1 className="text-2xl font-bold">Account {extendedStatus === "banned" ? "Banned" : "Unauthorized"}</h1>
                        <p>Please contact support for assistance.</p>
                    </div>
                </div>
            );
        case "incomplete":
            return null; // Handled by useEffect redirect
    }

    return (
        <div className="h-full w-full text-white">
            {/* Toast Container - moved to top level for better visibility */}
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
                limit={1}  // Changed to 1 since we're managing toasts more carefully now
                style={{ zIndex: 9999 }}
            />

            {/* Status Bar */}
            <div className="bg-gray-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <span className="text-sm">
                        Status: {extendedStatus}
                    </span>
                    <span className="text-sm">
                        Last login: {session?.user?.updatedAt && new Date(session.user.updatedAt).toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Debug Buttons Section */}
            {(session?.user?.role === 'ADMIN') && (
                <div className="container mx-auto px-4 py-4">
                    <div className="bg-gray-900 rounded-lg p-4">
                        <h2 className="text-xl font-semibold mb-4">Debug Actions</h2>
                        <div className="flex space-x-4">
                            <button
                                onClick={FatMan}
                                disabled={isLoading}
                                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Processing...' : 'Debug: Delete Users'}
                            </button>
                            <button
                                onClick={Listtheusers}
                                disabled={isLoading}
                                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Loading...' : 'Debug: List Users'}
                            </button>
                            <button
                                onClick={() => window.open('/cmd')}
                                disabled={isLoading}
                                className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Bash: Open session terminal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* User Info Section */}
                <div className="bg-gray-900 rounded-lg p-6 mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            <img
                                src={session?.user?.image || "/default-avatar.png"}
                                alt="Profile"
                                className="h-16 w-16 rounded-full"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">
                                Welcome back, {session?.user?.gender === "Male" ? "Mr." : "Ms."} {session?.user?.name || 'User'}
                            </h1>
                            <p className="text-gray-400">
                                {session?.user?.email || 'No email available'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Balance Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-900 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-2">Balance</h2>
                        <p className="text-3xl font-bold">
                            ${(session?.user?.balance || 0).toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Credit Cards Section */}
                <div className="bg-gray-900 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Your Credit Cards</h2>
                    {session?.user?.creditCards && session.user.creditCards.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {session.user.creditCards.map(card => (
                                <div
                                    key={card.id}
                                    className="bg-gray-800 p-4 rounded-lg"
                                >
                                    <p className="font-semibold">{card.holder}</p>
                                    <p className="text-gray-400">
                                        **** **** **** {card.number.slice(-4)}
                                    </p>
                                    <div className="flex justify-between mt-2">
                                        <span>
                                            Expires: {new Date(card.expirationDate).toLocaleDateString()}
                                        </span>
                                        <span className={`px-2 py-1 rounded text-sm ${card.isBlocked ? 'bg-red-500' : 'bg-green-500'}`}>
                                            {card.isBlocked ? "Blocked" : "Active"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {getCreditCardsLength() < 3 && (
                                <div className="flex justify-center items-center">
                                    <button
                                        onClick={AddCreditCard}
                                        disabled={isLoading}
                                        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Creating...' : 'Add New Credit Card'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-400 mb-4">
                                You have no credit cards on file.
                            </p>
                            <button
                                onClick={AddCreditCard}
                                disabled={isLoading}
                                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Creating...' : 'Add Your First Credit Card'}
                            </button>
                        </div>
                    )}
                    <div className="mt-6">
                        <TransactionForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;