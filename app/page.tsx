import { prisma } from "../lib/prisma";

export default async function Home() {
  const user = await prisma.user.findUnique({
    where: {
      email: "zogamaouddach@gmail.com",
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hello {user?.name}</h1>
      {/* <h1>{g}</h1> */} 
    </main>
  );
}
