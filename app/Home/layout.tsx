"use client"

import SideNav from "@/ui/SideNav";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/ui/Loading";

const Layout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status !== "authenticated") {
			router.push("/");
		}
	}, [status, router]);

	return (
		status === "loading" || !session ? (
			<Loading />
		) : (
			<div className="flex min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
				<div className="w-20 lg:w-64 bg-slate-900/70 backdrop-blur-lg border-r border-slate-700/50 text-white flex-shrink-0">
					<SideNav />
				</div>
				<main className="flex-grow overflow-auto">{children}</main>
			</div>
		)
	);
};

export default Layout;
