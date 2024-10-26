import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";


// Function to handle the POST request
export async function POST(request: Request) {
    const { email } = await request.json();

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 401 });
    }

    if (typeof email !== "string") {
        return NextResponse.json({ error: "Email must be a string" }, { status: 402 });
    }

    if (!email.includes("@")) {
        return NextResponse.json({ error: "Email is invalid" }, { status: 403 });
    }

    // Check for the user's email in the database
    let user;
    try {
        user = await prisma.user.findUnique({
            where: { email },
        });
    } catch (error) {
        console.error("Database error while finding user:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create a verification token for the user
    let token;
    try {
        token = await prisma.verificationToken.create({
            data: {
                userId: user.id,
                token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ""),
                createdAt: new Date(),
            },
        });
    } catch (error) {
        console.error("Database error while creating verification token:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    // Construct the verification URL
    const verificationUrl = `http://localhost:3000/activate/${token.token}`;
    console.log("\nverificationUrl:\n\t\t", verificationUrl);

    return new Response(JSON.stringify({ verificationUrl }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
