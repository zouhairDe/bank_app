"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BsGoogle, BsGithub } from "react-icons/bs";
import { Si42 } from "react-icons/si";
import Loading from "@/ui/Loading";

export default function Home() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSignIn = async () => {
		const result = await signIn("credentials", {
			redirect: false,
			email,
			password,
		});

		if (result?.error) {
			setError(result.error);
		} else {
			setError("");
			router.push("/Home");
		}
	};

	const handleSignUp = async () => {
		console.log("Email:", email);
		console.log("Password:", password);

		const result = await fetch("/api/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		});

		const data = await result.json();
		try {

		if (result.ok) {
			setError(""); // Clear any existing error message
			// Display success message or handle successful registration
			alert(data.message || "Registered Successfully"); // Show success message
			// Optionally, redirect to a different page or update the UI
		} else {
			setError(data.message || "An error occurred during sign up"); // Display error message
		}
	} catch (error) {
		console.error("Error during sign up:", error);
		setError("An unexpected error occurred");
	}
};

useEffect(() => {
	if (status === "authenticated" || session) {
		router.push("/Home");
	}
}, [status, router]);

if (status === "loading") {
	return <div>Loading...</div>;
}

return (
	session ? (
		<Loading />
	) : (
		<div className="w-full h-screen flex items-center justify-center bg-[#28273f]">
			<div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full flex gap-8">
				<div className="flex-1">
					<h1 className="text-2xl font-bold mb-4 text-[#28273f]">Welcome back, {"{user}"}!</h1>
					<div className="flex gap-8 mb-4">
						<button onClick={() => signIn("github")}><BsGithub className="h-6 w-6" /></button>
						<button onClick={() => signIn("google")}><BsGoogle className="h-6 w-6" /></button>
						<button onClick={() => signIn("42-school")}><Si42 className="h-6 w-6" /></button>
					</div>
				</div>

				<div className="flex-1">
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full p-2 border-2 border-[#28273f] rounded-2xl mb-4 focus:outline-none focus:border-blue-500"
					/>

					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full p-2 border-2 border-[#28273f] rounded-2xl mb-4 focus:outline-none focus:border-blue-500"
					/>

					{error && <p className="text-red-500">{error}</p>}

					<div className="fixed bottom-0 right-0 p-4">
						<button
							onClick={handleSignIn}
							className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
						>
							Login
						</button>
						<button
							onClick={handleSignUp}
							className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
						>
							Sign Up
						</button>
					</div>
				</div>
			</div>
		</div>
	)
);
}
