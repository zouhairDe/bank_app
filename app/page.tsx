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
        <button onClick={() => ListUsers()}>LIST USERSSSSSSSSSSSSSS</button>
        <button className="" onClick={() => signOut()}>Sign out from github</button>
      </div>
    ) : (
      <div className="flex w-full h-full items-center justify-center">
        {/* <button onClick={fff}>delete users</button> */}
        <button onClick={ListUsers}>List users</button>
        <button className="" onClick={() => signIn("github")}>Sign in with github</button>
      </div>


    )
  )
}
