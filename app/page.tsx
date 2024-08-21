"use client"

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [userName, setUserName] = useState(null);

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
      setUserName(msg.name);
    } catch (error) {
      console.log(error);
    }
  }


  // function fff() {
  //   fetch("/api", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   }).then((res) => res.json()).then((data) => console.log(data));
  // }

  return (
    session ? (
      <div>
        <h1>Welcome to the home page</h1>
        <p>Hi, {session.user?.name} {JSON.stringify(session)}</p>
        <button className="" onClick={() => signOut()}>Sign out from github</button>
      </div>
    ) : (
      <div className="flex w-full h-full items-center justify-center">
        {/* <button onClick={fff}>delete default user</button> */}
        <button className="" onClick={() => signIn("github")}>Sign in with github</button>
      </div>
    )
  )
}
