import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10)
}

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  image: string;
  location: string;
  gender: string;
  password: string;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user?.id;
    if (!userId || userId !== params.id) {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const { formData, extendedStatus } = body;

    if (!formData) {
      return NextResponse.json({ message: "No form data provided" }, { status: 400 });
    }

    if (extendedStatus !== "incomplete") {
      return NextResponse.json({ message: "Invalid user status" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Validation
    if (!formData.name || !formData.email || !formData.phoneNumber || !formData.location || !formData.gender) {
      return NextResponse.json({ message: "Required fields are missing" }, { status: 400 });
    }

    if (!["Male", "Female"].includes(formData.gender)) {
      return NextResponse.json({ message: "Invalid gender value" }, { status: 400 });
    }

    if (formData.password && user.provider === "email") {
      console.log("User provider:", user.provider, "Password:", formData.password);
      return NextResponse.json({ message: "You can change your Password later on Settings > Privacy and security" }, { status: 400 });
    }

    if (session?.user.provider !== 'email' && (formData.password.length < 8 || formData.password.length > 72)) {
      return NextResponse.json({ message: "Password must be between 8 and 70 character" }, { status: 400 });
    }

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        image: formData.image || user.image,
        location: formData.location,
        gender: formData.gender,
        DataSubmitted: true,
        password: hashPassword(formData.password),
      },
    });

    return NextResponse.json({ message: "User data updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}