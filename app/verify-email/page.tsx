"use client"

import React from 'react'
import { useEffect, useState } from "react";
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
        
        console.log('Email sent successfully!', response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error("Failed to send verification email");
    }
};

const VerifyEmail = () => {
    const { data: session, status, update } = useSession(); // Add update function
    const [verurl, setVerurl] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

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
                // Update the session to reflect verification
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

    return (
        <>
            <div>verifyEmail</div>
            <button onClick={() => signOut()}>Sign-out</button>
            <button onClick={sendVerificationEmail}>send Verification email?</button>
            <div onClick={testActivation}>Verify email</div>
        </>
    )
}

export default VerifyEmail;