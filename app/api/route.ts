import { prisma } from "../../lib/prisma";
import { cookies } from 'next/headers'

export async function GET(request: Request) {

  try {
    const user = await prisma.user.findMany();
    return Response.json(user, {
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
