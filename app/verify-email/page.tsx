"use client"

import React, { useEffect, useState } from 'react';
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from '@/ui/Loading';
import emailjs from '@emailjs/browser';

const sendEmail = async (email: string, verificationUrl: string) => {
    emailjs.init({
        publicKey: process.env.NEXT_PUBLIC_EMAILJS_USER_ID
    });
    try {
        const templateParams = {
            to_email: email,
            verification_url: verificationUrl,
        };

        const response = await emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
            templateParams
        );

    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error("Failed to send verification email");
    }
};

const VerifyEmail = () => {
    const { data: session, status, update } = useSession();
    const [verurl, setVerurl] = useState<string>("");
    const [showBackdrop, setShowBackdrop] = useState(false); // Add backdrop state
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user?.isVerified) {
            router.push("/Home");
        }
    }, [session, router]);

    if (status === "loading") {
        return <Loading />;
    }

    const sendVerificationEmail = async () => {
        const response = await fetch("/api/send-verification-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: session?.user.email }),
        });

        if (response.ok) {
            const data = await response.json();
            const verificationUrl = data.verificationUrl;
            console.log('Verification URL:', verificationUrl);
            setVerurl(verificationUrl.split("/")[4]);

            await sendEmail(session?.user.email as string, verificationUrl);
            alert("Verification email sent");
        } else {
            const text = await response.json();
            console.error("Error response:", text);
            alert("Failed to send verification email");
        }
    };

    const testActivation = async () => {
        try {
            if (!verurl) {
                alert("No verification URL available");
                return;
            }

            console.log("Attempting to activate with token:", verurl);

            const response = await fetch(`/api/activate/${verurl}`, {
                method: "GET",
            });

            if (response.ok) {
                await update({ isVerified: true });
                router.push('/Home');
                alert("Account activated successfully!");
            } else {
                const errorData = await response.json();
                console.error("Error response:", errorData);
                alert(errorData.error || "Failed to activate account");
            }
        } catch (error) {
            console.error("Activation error:", error);
            alert("Failed to activate account");
        }
    };

    // Sign-out handler with backdrop
    const handleSignOut = () => {
        setShowBackdrop(true);  // Show the backdrop
        signOut({ callbackUrl: "/" });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Main verification card */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
                    {/* Email icon */}
                    <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>

                    {/* Title and description */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2">
                            Verify Your Email
                        </h1>
                        <p className="text-slate-300">
                            Please verify your email address to continue using your account.
                        </p>
                        {session?.user?.email && (
                            <p className="text-blue-300 text-sm mt-2 font-medium">
                                {session.user.email}
                            </p>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-4">
                        <button
                            onClick={sendVerificationEmail}
                            className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-lg"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Send Verification Email
                        </button>

                        {verurl && (
                            <button
                                onClick={testActivation}
                                className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm font-medium rounded-lg hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 shadow-lg"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Activate Account
                            </button>
                        )}
                    </div>

                    {/* Status message */}
                    {verurl && (
                        <div className="mt-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-emerald-300 text-sm">
                                    Verification email sent! Click "Activate Account" to verify.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sign out button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={handleSignOut}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Backdrop overlay with spinner */}
            {showBackdrop && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center">
                        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-white font-medium">Signing out...</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VerifyEmail;
