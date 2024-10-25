"use client"

import React from 'react'
import { useEffect, useState } from "react";
import { signOut } from 'next-auth/react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from '@/ui/Loading';


const verifyEmail = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/");
		}
	}, [status, router]);
    if (status === "loading")
    {
        return <Loading />;
    }

  return (
    <>
        <div>verifyEmail</div>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <button onClick={() => signOut()}>Sign-out</button>
    </>
  )
}

export default verifyEmail