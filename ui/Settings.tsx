"use client";

import React, { useEffect, useState } from "react";
import { useExtendedStatus } from "@/hooks/useExtendedStatus";

import {
    LanguagesIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";

const SettingsComponent = () => {
    const [showBackDrop, setShowBackDrop] = useState(false);
    const [activeItem, setActiveItem] = useState("profile");

    const { extendedStatus, session } = useExtendedStatus();
    const settingsItems = [
        { id: "Personal Information", icon: LanguagesIcon, label: "Personal Information" },
        { id: "change password", icon: LanguagesIcon, label: "change password" },
        { id: "Data&Privacy", icon: LanguagesIcon, label: "Data&Privacy" },
        // { id: "payments", icon: LanguagesIcon, label: "Payments" },
        // { id: "accounts", icon: LanguagesIcon, label: "Accounts" },
    ];

    const handleSignOut = () => {
        setShowBackDrop(true);
        setTimeout(() => {
            signOut({ callbackUrl: "/" });
            console.log("Signing out...");
        }, 1000);
    };

    return (
        <>
            <div className="w-[80%] h-[80%]">{/*container div*/}
            <h2>User Settings</h2>
                <div></div>{/* left Div for settingsitems */}
                <div></div>{/* right Div for item content */}
            </div>
        </>
    )
}

export default SettingsComponent;