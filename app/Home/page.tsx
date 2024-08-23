"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/ui/Loading";

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  function ListUsers() {
    fetch("/api", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  }

  console.log(session);

  if (status === "loading" || status === "unauthenticated") {
    return <Loading />;
  }
console.log(session)
  const DefImage = "https://w7.pngwing.com/pngs/831/88/png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png"

  return (
    <div className="h-full w-full text-white">
      <h1>Welcome to the home page</h1>
      <p>Hi, {session?.user?.name}</p>
      <p>Your image:</p>
      <img
        className="w-40 h-40 rounded-lg"
        src={session?.user?.image || DefImage}
        alt="userImage"
      />
      <p>Your email:</p>
      <p>{session?.user?.email}</p>

      <button onClick={ListUsers}>LIST USERS</button>
    </div>
  );
};

export default Home;
