import { prisma } from "../../../lib/prisma";
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    console.log("Email:", email, "Password:", password);//hhhhhh
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
    if (password.length < 8 || password.length > 72) {
      return new Response(
        JSON.stringify({ message: 'Password must be between 8 and 72 characters' }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in the database
    const newUser = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: "Unknown User" + Math.floor(Math.random() * 1000),
        password: hashedPassword,
        role: "user",
        provider: "email",
        image: "",
        phoneNumber: "",
        location: "",
        balance: 0,
        isBanned: false,
        isVerified: false,
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
