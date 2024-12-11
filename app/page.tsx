"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BsGoogle, BsGithub } from "react-icons/bs";
import { Si42 } from "react-icons/si";
import Loading from "@/ui/Loading";
import Icons from "@/ui/Icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import { PiEyeClosedBold, PiEyeBold } from "react-icons/pi";
import { useRiveState } from '../context/RiveContext';

export default function Home() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [toastId, setToastId] = useState(null as any);
	const [isSignUp, setIsSignUp] = useState(false);
	const [onPassword, setOnPassword] = useState(false);
	const { setRiveState } = useRiveState();

	const buttonVariants = {
		initial: { scale: 1, rotate: 0 },
		hover: { scale: 1.1, rotate: 10 },
		click: { scale: 0.9, rotate: -10 },
	};

	const handleSignIn = async () => {
		setRiveState(["Loop", "Face to chat"]);
		if (loading || toast.isActive(toastId)) return; // Prevent multiple clicks and new toasts if one is already active
		setLoading(true);

		toast.dismiss();
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
			console.error("Error signing in:", result.error, "result code:", result.status);
			toast.update(newToastId, {
				render: result.error,
				type: "error",
				isLoading: false,
				autoClose: 1000,
			});
			setLoading(false);
		} else {
			toast.update(newToastId, {
				render: "Signed in successfully!",
				type: "success",
				isLoading: false,
				autoClose: 1000,
			});

			setTimeout(() => {
				router.push("/Home");
			}, 3000);
		}
	};


	const handleSignUp = async () => {
		setRiveState(["Loop", "Face to chat"]);
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
					autoClose: 1000,
				});
				setLoading(false);
			} else if (result.status === 409) {
				toast.update(newToastId, {
					render: data.message || "User already registered",
					type: "error",
					isLoading: false,
					autoClose: 1000,
				});
				setLoading(false);
			} else {
				toast.update(newToastId, {
					render: data.message || "An error occurred during sign up",
					type: "error",
					isLoading: false,
					autoClose: 1000,
				});
				setLoading(false);
			}
		} catch (error) {
			console.error("Error during sign up:", error);
			toast.update(newToastId, {
				render: "An unexpected error occurred",
				type: "error",
				isLoading: false,
				autoClose: 1000,
			});
			setLoading(false);
		}
	};

	function validateEmail(email: string) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	const handleOAuthSignIn = async (provider: string, option: number) => {
		setRiveState(["Loop", "Face to chat"]);
		if (loading || toast.isActive(toastId)) return;
		setLoading(true);

		toast.dismiss();
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
				autoClose: 1000,
			});
			setLoading(false);
		} else {
			toast.update(newToastId, {
				render: `Signed in successfully with ${provider}!`,
				type: "success",
				isLoading: false,
				autoClose: 1000,
			});
			setTimeout(() => {
				router.push("/Home");
			}, 3000);
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
		<div className="bg-[#F0ECE5] rounded-[64px] shadow-lg px-8 py-8">
			<div className="flex h-[45%] py-8 font-bold">
				<div className="py-8 px-8 max-w-[456px]">
					<strong className="text-6xl font-bold text-[#28273f] py-8 mb-8">
						Welcome back, {"{user}"}!
					</strong>
					<div className="flex justify-around items-center gap-10">
						<button
							onClick={() => handleOAuthSignIn("github", 0)}
							className={`${loading ? "cursor-not-allowed" : ""}`}
							disabled={loading}
						>
							<Icons.GitHub className="h-28 w-h-28" />
						</button>
						<button
							onClick={() => handleOAuthSignIn("google", 0)}
							className={`${loading ? "cursor-not-allowed" : ""}`}
							disabled={loading}
						>
							<Icons.Google className="h-28 w-h-28" />
						</button>
						<button
							onClick={() => handleOAuthSignIn("42-school", 0)}
							className={`${loading ? "cursor-not-allowed" : ""}`}
							disabled={loading}
						>
							<Icons.FortyTwo className="h-28 w-h-28" />
						</button>
					</div>
				</div>

				<div className="flex flex-col justify-center items-center p-4">
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full mb-8 h-16 px-8 py-2 border-2 border-[#28273f] rounded-full focus:outline-none focus:border-blue-500"
					/>
					<div className="relative">
						<input
							type={onPassword ? "text" : "password"}
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full h-16 px-8 py-2 border-2 border-[#28273f] rounded-full focus:outline-none focus:border-blue-500"
						/>
						<button
							className="absolute right-1 top-[50%] transform translate-y-[-50%] translate-x-[-50%] rounded-full"
							onClick={() => setOnPassword(!onPassword)}
						>
							{onPassword ? (
								<PiEyeBold className="h-8 w-8" />
							) : (
								<PiEyeClosedBold className="h-8 w-8" />
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);

	const SignUpForm = (
		<div className="bg-[#F0ECE5] rounded-[64px] shadow-lg px-8 py-10 max-w-[796px] items-center justify-center w-full flex gap-8 h-[70%] flex-col">
			<div className="flex h-[45%] w-[100%] gap-6 font-bold items-center justify-center px-6 py-4">
				<div className="flex-1 px-2">
					<strong className="text-6xl font-bold text-[#28273f] py-8 mb-8">New here?</strong>
					<h2 className="text-3xl font-bold text-[#28273f] py-8 mb-8">
						Become a member today for only $9.99!
					</h2>
				</div>

				<div className="flex flex-col justify-center items-center">
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full mb-8 h-16 px-8 py-2 border-2 border-[#28273f] rounded-full focus:outline-none focus:border-blue-500"
					/>
					<div className="relative">
						<input
							type={onPassword ? "text" : "password"}
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full h-16 px-8 py-2 border-2 border-[#28273f] rounded-full focus:outline-none focus:border-blue-500"
						/>
						<button
							className="absolute right-1 top-[50%] transform translate-y-[-50%] translate-x-[-50%] rounded-full"
							onClick={() => setOnPassword(!onPassword)}
						>
							{onPassword ? (
								<PiEyeBold className="h-8 w-8" />
							) : (
								<PiEyeClosedBold className="h-8 w-8" />
							)}
						</button>
					</div>

					<div className="flex-1 gap-8 mb-4 mt-10">
						<div className="text-[#28273f] grid grid-cols-3 items-center w-full -translate-y-5">
							<hr className="border-[#28273f] border-2 rounded-2xl" />
							<p className="text-center font-bold text-lg"> Or </p>
							<hr className="border-[#28273f] border-2 rounded-2xl" />
						</div>
						<div className="flex justify-around items-center gap-10">
							<button
								onClick={() => handleOAuthSignIn("github", 0)}
								className={`${loading ? "cursor-not-allowed" : ""}`}
								disabled={loading}
							>
								<Icons.GitHub className="h-16 w-16" />
							</button>
							<button
								onClick={() => handleOAuthSignIn("google", 0)}
								className={`${loading ? "cursor-not-allowed" : ""}`}
								disabled={loading}
							>
								<Icons.Google className="h-16 w-16" />
							</button>
							<button
								onClick={() => handleOAuthSignIn("42-school", 0)}
								className={`${loading ? "cursor-not-allowed" : ""}`}
								disabled={loading}
							>
								<Icons.FortyTwo className="h-16 w-16" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);


	return (
		<div className="w-full h-screen flex items-center justify-center bg-[#28273f]">
			<ToastContainer />
			<AnimatePresence mode="wait">
				{isSignUp ? (
					<motion.div
						key="signUp"
						initial={{ opacity: 0, x: -100 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 100 }}
						transition={{ duration: 0.5 }}
					>
						{SignUpForm}
					</motion.div>
				) : (
					<motion.div
						key="login"
						initial={{ opacity: 0, x: 100 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -100 }}
						transition={{ duration: 0.5 }}
					>
						{LoginForm}
					</motion.div>
				)}
			</AnimatePresence>

			<motion.div
				className={`flex flex-col fixed bottom-0 ${!isSignUp ? "right-0" : "left-0"
					}`}
				variants={buttonVariants}
				initial="initial"
				whileHover="hover"
				whileTap="click"
			>
				<button
					onClick={() => setIsSignUp(!isSignUp)}
					className={`w-60 ${!isSignUp
						? "translate-x-24 pr-16 translate-y-10"
						: "-translate-x-24 pl-16 translate-y-10"
						} pb-8 pt-6 font-Space_Grotesk font-bold flex-1 bg-[#F0ECE5] text-[#28273f] border-4 border-[#2a2931] rounded-full hover:bg-[#e2e0dc] ${loading ? "cursor-not-allowed" : ""
						}`}
					disabled={loading}
				>
					{isSignUp ? "Or Login?" : "Or Register?"}
				</button>
				<button
					onClick={!isSignUp ? handleSignIn : handleSignUp}
					className={`w-60 ${!isSignUp
						? "translate-x-16 translate-y-4"
						: "-translate-x-16 translate-y-4"
						} font-Space_Grotesk font-bold flex-1 bg-[#F0ECE5] text-[#28273f] border-4 border-[#2a2931] py-8 rounded-full m-0 hover:bg-[#e2e0dc] ${loading ? "cursor-not-allowed" : ""
						}`}
					disabled={loading}
				>
					{isSignUp ? "Register" : "Login"}
				</button>
			</motion.div>
		</div>
	);
}
