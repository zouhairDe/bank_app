"use client"

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { BsGoogle, BsGithub } from "react-icons/bs";
import { Si42 } from "react-icons/si";

export default function Home() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const getUser = async () => {
    try {
      const msg = await fetch("/api/hello",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer",
          },
        }).then((res) => res.json());
      console.log(msg);
    } catch (error) {
      console.log(error);
    }
  }

  function ListUsers() {
    fetch("/api", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json()).then((data) => console.log(data));
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    session ? (
      <div>
        <h1>Welcome to the home page</h1>
        <p>Hi, {session.user?.name} {JSON.stringify(session)}</p>
        <button className="" onClick={() => signOut()}>Sign out from github</button>
      </div>
    ) : (
      <div className="w-full h-screen flex items-center justify-center bg-[#28273f]">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full flex gap-8">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-4 text-[#28273f]">Welcome back, {"{user}"}!</h1>
            <div className="flex gap-8 mb-4">
              <BsGithub className="h-6 w-6" />
              <BsGoogle className="h-6 w-6" />
              <Si42 className="h-6 w-6" />
            </div>
          </div>

          <div className="flex-1">
          <input
                  type="email"
                  placeholder=" "
                  value={email}
                  onFocus={(e) => e.target.placeholder = ""}
                  onBlur={(e) => e.target.placeholder = " "}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-200 ${email ? 'pt-6' : 'pt-2'}`}
                />
                <label className={`absolute left-2 top-2 transition-all duration-200 ${email ? 'text-xs text-blue-500' : 'text-gray-500'}`}>
                  Email
                </label>

            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border-2 border-[#28273f] rounded-2xl mb-4 focus:outline-none focus:border-blue-500"
            />

            <div className="fixed bottom-0 right-0 p-4">
              <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Login
              </button>
              <p className="text-center">
                Or <a href="#" className="text-blue-500">Sign up?</a>
              </p>
            </div>

          </div>
        </div>
      </div>


    )
  )
}
