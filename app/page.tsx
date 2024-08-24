"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BsGoogle, BsGithub } from "react-icons/bs";
import { Si42 } from "react-icons/si";
import Loading from "@/ui/Loading";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [toastId, setToastId] = useState(null);
	const [isSignUp, setIsSignUp] = useState(false);

	const handleSignIn = async () => {
		if (loading || toast.isActive(toastId)) return; // Prevent multiple clicks and new toasts if one is already active
		setLoading(true);

		toast.dismiss(); // Dismiss any existing toasts
		const newToastId = toast.loading("Signing in...", {
			position: "top-right",
		});
		setToastId(newToastId);

		const result = await signIn("credentials", {
			redirect: false,
			email,
			password,
		});

		if (result?.error) {
			toast.update(newToastId, {
				render: result.error,
				type: "error",
				isLoading: false,
				autoClose: 5000,
			});
			setLoading(false);
		} else {
			toast.update(newToastId, {
				render: "Signed in successfully!",
				type: "success",
				isLoading: false,
				autoClose: 5000,
			});
			setTimeout(() => {
				router.push("/Home");
			}, 3000);
		}
	};

	const handleSignUp = async () => {
		if (loading || toast.isActive(toastId)) return; // Prevent multiple clicks and new toasts if one is already active
		setLoading(true);

		toast.dismiss(); // Dismiss any existing toasts
		if (email && validateEmail(email) === false) {
			toast.error("Please enter a valid email address");
			setLoading(false);
			return;
		}
		const newToastId = toast.loading("Signing up...", {
			position: "top-right",
		});
		setToastId(newToastId);

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
				toast.update(newToastId, {
					render: data.message || "Registered Successfully",
					type: "success",
					isLoading: false,
					autoClose: 5000,
				});
				setLoading(false);
			} else {
				toast.update(newToastId, {
					render: data.message || "An error occurred during sign up",
					type: "error",
					isLoading: false,
					autoClose: 5000,
				});
				setLoading(false);
			}
		} catch (error) {
			console.error("Error during sign up:", error);
			toast.update(newToastId, {
				render: "An unexpected error occurred",
				type: "error",
				isLoading: false,
				autoClose: 5000,
			});
			setLoading(false);
		}
	};

	function validateEmail(email: string) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	const handleOAuthSignIn = async (provider: string) => {
		if (loading || toast.isActive(toastId)) return; // Prevent multiple clicks and new toasts if one is already active
		setLoading(true);

		toast.dismiss(); // Dismiss any existing toasts
		const newToastId = toast.loading(`Signing in with ${provider}...`, {
			position: "top-right",
		});
		setToastId(newToastId);

		const result = await signIn(provider, { redirect: false });

		if (result?.error) {
			toast.update(newToastId, {
				render: result.error,
				type: "error",
				isLoading: false,
				autoClose: 5000,
			});
			setLoading(false);
		} else {
			toast.update(newToastId, {
				render: `Signed in successfully with ${provider}!`,
				type: "success",
				isLoading: false,
				autoClose: 5000,
			});
			setTimeout(() => {
				router.push("/Home");
			}, 3000); // Delay to allow the toast to be visible
		}
	};

	useEffect(() => {
		if (status === "authenticated" || session) {
			router.push("/Home");
		}
	}, [status, router]);

	if (status === "loading") {
		return <Loading />;
	}

	const LoginForm = (
		<div className="bg-[#F0ECE5] rounded-3xl shadow-lg p-8 max-w-xl items-center justify-center w-full flex gap-8 h-[60%] flex-col">
			<div className="flex h-[45%] w-[90%] gap-6 mt-12">
				<div className="flex-1">
					<h1 className="text-4xl font-bold mb-4 text-[#28273f]">Welcome back, {"{user}"}!</h1>
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
				</div>
			</div>
			<div className="flex-1 gap-8 mb-4 w-[90%]">
				<div className="text-[#28273f] grid grid-cols-3 items-center w-full -translate-y-8">
					<hr className="border-[#28273f] border-2 rounded-2xl" />
					<p className="text-center font-bold text-lg"> Or </p>
					<hr className="border-[#28273f] border-2 rounded-2xl" />
				</div>
				<div className="flex items-center justify-center gap-10">
					<button onClick={() => handleOAuthSignIn("github")} className={`${loading ? 'cursor-not-allowed' : ''}`} disabled={loading}><BsGithub className="h-10 w-10" /></button>
					<button onClick={() => handleOAuthSignIn("google")} className={`${loading ? 'cursor-not-allowed' : ''}`} disabled={loading}><BsGoogle className="h-10 w-10" /></button>
					<button onClick={() => handleOAuthSignIn("42-school")} className={`${loading ? 'cursor-not-allowed' : ''}`} disabled={loading}><Si42 className="h-10 w-10" /></button>
				</div>
			</div>
		</div>
	);

	const SignUpForm = (
		<div className="bg-[#F0ECE5] rounded-3xl shadow-lg p-8 max-w-[620px] items-center justify-center w-full flex gap-8 h-[60%] flex-col">
			<div className="flex h-[45%] w-[100%] gap-6 font-bold items-center justify-center">
				<div className="flex-1">
					<h1 className="text-4xl font-bold mb-4 text-[#28273f]">New here?!</h1>
					<h2 className="text-2xl text-[#28273f]">Become a member today for only $9.99!</h2>
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

					<div className="flex-1 gap-8 mb-4 w-[90%] mt-10">
						<div className="text-[#28273f] grid grid-cols-3 items-center w-full -translate-y-8">
							<hr className="border-[#28273f] border-2 rounded-2xl" />
							<p className="text-center font-bold text-lg"> Or </p>
							<hr className="border-[#28273f] border-2 rounded-2xl" />
						</div>
						<div className="flex items-center justify-center gap-10">
							<button onClick={() => handleOAuthSignIn("github")} className={`${loading ? 'cursor-not-allowed' : ''}`} disabled={loading}><BsGithub className="h-10 w-10" /></button>
							<button onClick={() => handleOAuthSignIn("google")} className={`${loading ? 'cursor-not-allowed' : ''}`} disabled={loading}><BsGoogle className="h-10 w-10" /></button>
							<button onClick={() => handleOAuthSignIn("42-school")} className={`${loading ? 'cursor-not-allowed' : ''}`} disabled={loading}><Si42 className="h-10 w-10" /></button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);


	return (
		<div className="w-full h-screen flex items-center justify-center bg-[#28273f]">
			<ToastContainer />
			{isSignUp ? SignUpForm : LoginForm}
			<div className={`flex flex-col fixed bottom-0 ${!isSignUp ? "right-0" : "left-0"}`}>
				<button
					onClick={() => setIsSignUp(!isSignUp)}
					className={`w-60 ${!isSignUp ? "translate-x-24 pr-16 translate-y-10" : "-translate-x-24 pl-16 translate-y-10"} pb-8 pt-6 font-Space_Grotesk font-bold flex-1 bg-[#F0ECE5] text-[#28273f] border-4 border-[#2a2931] rounded-full hover:bg-green-600 ${loading ? 'cursor-not-allowed' : ''}`}
					disabled={loading}
				>
					{(isSignUp ? "Or Login?" : "Or Register?")}
				</button>
				<button
					onClick={!isSignUp ? handleSignIn : handleSignUp}
					className={`w-60 ${!isSignUp ? "translate-x-16 translate-y-4" : "-translate-x-16 translate-y-4"} font-Space_Grotesk font-bold flex-1 bg-[#F0ECE5] text-[#28273f] border-4 border-[#2a2931] py-8 rounded-full m-0 hover:bg-blue-600 ${loading ? 'cursor-not-allowed' : ''}`}
					disabled={loading}
				>
					{(isSignUp ? "Register" : "Login")}
				</button>
			</div>
		</div>
	);
}


//kffk