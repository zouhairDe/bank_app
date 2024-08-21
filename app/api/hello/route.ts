import { prisma } from "../../../lib/prisma";

export async function GET(request: Request) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: "seedTest@gmail.com",
      },
    });
    return Response.json({ message: "Hello from a7a"}, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  catch (error) {
    console.log(error);
    return Response.json({ message: 'Internal server error, Ghyrha' }, {
      status: 501,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
