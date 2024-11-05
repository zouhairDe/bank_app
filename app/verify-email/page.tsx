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

    if (status === "loading") {
        return <Loading />;
    }

    useEffect(() => {
        if (session?.user?.isVerified) {
            router.push("/Home");
        }
    }, [session, router]);

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
        <>
            <div>verifyEmail</div>
            <button onClick={handleSignOut}>Sign-out</button>
            <br/>
            <button onClick={sendVerificationEmail}>send Verification email?</button>
            <div onClick={testActivation}>Verify email</div>

            {/* Backdrop overlay with spinner */}
            {showBackdrop && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                }}>
                    <div style={{
                        width: "50px",
                        height: "50px",
                        border: "5px solid rgba(255, 255, 255, 0.3)",
                        borderTop: "5px solid white",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                    }} />
                </div>
            )}

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
}

export default VerifyEmail;
