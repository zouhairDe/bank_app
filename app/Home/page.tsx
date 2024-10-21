"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/ui/Loading";
import InfiniteScroll from 'react-infinite-scroll-component';

// interface UserCreditCard {
// 	id: string;
// 	number: string;
// 	expirationDate: Date;
// 	cvv: string;
// 	holder: string;
// 	isBlocked: boolean;
// }

// interface ExtendedSession {
// 	user: {
// 		id: string;
// 		role: string;
// 		email?: string | null;
// 		name?: string | null;
// 		image?: string | null;
// 		phoneNumber?: string | null;
// 		location?: string | null;
// 		balance?: number;
// 		transactions?: string[];
// 		creditCards?: UserCreditCard[];
// 	};
// }

const Home = () => {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [loading, setLoading] = useState(false); // Not used, consider removing or managing it

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/");
		}
	}, [status, router]);

	if (status === "loading" || status === "unauthenticated") {
		return <Loading />;
	}

	return (
		<div className="h-full w-full text-white">
			{/* User data container */}
			<div className="flex flex-col items-center justify-center">
				<h1 className="text-4xl font-bold">Welcome {session?.user?.name}</h1>
				<p className="text-xl">Balance: {session?.user?.balance}</p> {/* Corrected from email to balance */}
			</div>

			{/* Display user credit cards if needed */}
			{session?.user?.creditCards?.length > 0 && (
				<div className="mt-4">
					<h2 className="text-2xl font-semibold">Your Credit Cards</h2>
					<ul className="list-disc">
						{session.user.creditCards.map(card => (
							<li key={card.id}>
								<p>Holder: {card.holder}</p>
								<p>Number: **** **** **** {card.number.slice(-4)}</p>
								<p>Expires: {new Date(card.expirationDate).toLocaleDateString()}</p>
								<p>Status: {card.isBlocked ? "Blocked" : "Active"}</p>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default Home;
