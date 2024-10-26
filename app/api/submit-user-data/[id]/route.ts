import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server';

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  image: string;
  location: string;
  gender: string;
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
      },
    });

    return NextResponse.json({ message: "User data updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}