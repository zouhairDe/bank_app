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
			<div className="flex h-screen w-full">
				<div className="w-[8%] bg-gray-900 text-white">
					<SideNav />
				</div>
				<main className="flex-grow bg-[#28273f] p-4">{children}</main>
			</div>
		)
	);
};

export default Layout;
