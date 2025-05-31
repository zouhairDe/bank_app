"use client"

import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from '@/ui/Loading';

interface messageContainer {
    message: string;
    type: string;
}

const ActivationPage = () => {
    const { data: session, status, update } = useSession();
    const [verurl, setVerurl] = useState<string>("");
    const [showBackdrop, setShowBackdrop] = useState(false); // Add backdrop state
    const router = useRouter();

    let message: messageContainer = {
        message: "",
        type: ""
    }

    const testActivation = async () => {
        const url = window.location.pathname.split("/").pop();
        try {
            if (!url) {
                alert("No verification URL available");
                return;
            }
            setShowBackdrop(true);

            console.log("Attempting to activate with token:", url);

            const response = await fetch(`/api/activate/${url}`, {
                method: "GET",
            });

            if (response.ok) {
                await update({ isVerified: true });
                setShowBackdrop(false);
                router.push('/Home');//maybe somehow i can close window and redirect to login page
                message.message = "Account activated successfully!";
            } else {
                setShowBackdrop(false);
                const errorData = await response.json();
                console.error("Error response:", errorData);
                message.message = "Failed to activate account";
            }
        } catch (error) {
            console.error("Activation error:", error);
            alert("An error occurred while activating your account");
        }
    };

  return (
    <>
        {
            (showBackdrop) ? <Loading /> : (
                <div>
                    <button onClick={testActivation}> Activate Account </button>
                    <p>{message.message}</p>
                </div>
            )
        }
    </>
  )
}

export default ActivationPage