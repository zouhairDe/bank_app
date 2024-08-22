import { prisma } from "../../../lib/prisma";
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate input
	console.log("Email:", email, "Password:", password);
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: 'Email and password are required' }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'User already registered' }),
        { status: 409, headers: { "Content-Type": "application/json" } } // Changed to 409
      );
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        name: "Unknown User"+Math.floor(Math.random() * 1000),
        password: hashedPassword,
        role: "user",
        provider: "email",
        city: null,
        country: null,
        image: "",
        phoneNumber: "",
      },
    });

    return new Response(
      JSON.stringify({ message: "Registered Successfully" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
