import { prisma } from "../../lib/prisma";
import { cookies } from 'next/headers'

export async function GET(request: Request) {

  // const cookie = cookies();// get the cookie from the request hadchi mnb3d ndirouh
  try {
    const user = await prisma.user.findMany();//to list all users
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
