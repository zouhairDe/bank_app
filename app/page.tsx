"use client"

import { useState, useEffect } from "react";

export default function Home() {

  const [userName, setUserName] = useState(null);

  useEffect(() => {
    getTable();
  }, []);

  const getTable = async () => {
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button onClick={getTable}>Fetch tables</button>
      {userName && <h1>Hello {userName}</h1>}
    </main>
  );
}
