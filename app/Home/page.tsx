"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/ui/Loading";
import { useExtendedStatus } from '@/hooks/useExtendedStatus';

const Home = () => {
    const { extendedStatus, session } = useExtendedStatus();
    const router = useRouter();

    const FatMan = async () => {
        try {
            const response = await fetch('/api/delete-users', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || response.statusText);
            }
            
            console.log('Successfully deleted:', data.message);
            return data;
        } catch (error) {
            console.error('Failed to delete users:', error);
            throw error; // Re-throw to handle in the component
        }
    };

    const Listtheusers = async () => {
        const response = await fetch('/api/list-users', {
            method: 'GET',
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data.message);
        } else {
            console.error('Failed to list users:', response.statusText);
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
                router.push("/complete-profile");//maybe a hoverdiv instead
                break;
        }
    }, [extendedStatus, router]);

    if (extendedStatus === "loading") {
        return <Loading />;
    }

    switch (extendedStatus) {
        case "unauthenticated":
        case "banned":
            return (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center text-red-500">
                        <h1 className="text-2xl font-bold">Account Banned</h1>
                        <p>Please contact support for assistance.</p>
                    </div>
                </div>
            );
        case "incomplete":
    }

    return (
        <div className="h-full w-full text-white">
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
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition-colors"
                        >
                            Debug: Delete Users
                        </button>
                        <button 
                            onClick={Listtheusers}
                            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition-colors"
                        >
                            Debug: List Users
                        </button>
                        <button 
                            onClick={() => window.open('/cmd')}
                            className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded transition-colors"
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
                                Welcome back, {session?.user?.gender === "Male" ? "Mr." : "Ms."} {session?.user?.name}
                            </h1>
                            <p className="text-gray-400">
                                {session?.user?.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Balance Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-900 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-2">Balance</h2>
                        <p className="text-3xl font-bold">
                            ${session?.user?.balance.toFixed(2)}
                        </p>
                    </div>
                    {/* Add more stat boxes as needed */}
                </div>

                {/* Credit Cards Section */}
                {session?.user?.creditCards && session.user.creditCards.length > 0 && (
                    <div className="bg-gray-900 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Your Credit Cards</h2>
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
                                        <span className={`px-2 py-1 rounded text-sm ${
                                            card.isBlocked ? 'bg-red-500' : 'bg-green-500'
                                        }`}>
                                            {card.isBlocked ? "Blocked" : "Active"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;