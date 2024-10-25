import { prisma } from "@/lib/prisma";
export async function GET(
    request: Request, 
    { params }: { params: { token: string } }
) {
    try {
        const token = params.token;

        if (!token) {
            return new Response("Token is required", { status: 400 });
        }

        if (typeof token !== "string") {
            return new Response("Token must be a string", { status: 400 });
        }

        console.log("Attempting to verify token:", token);

        const verificationToken = await prisma.verificationToken.findUnique({
            where: {
                token: token,
            },
        });

        if (!verificationToken) {
            console.log("Token not found");
            return new Response("Invalid or expired token", { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: {
                VerificationToken: {
                    some: {
                        AND: [
                            { ActivatedAt: null },
                            {
                                createdAt: {
                                    gt: new Date(Date.now() - 24 * 60 * 60 * 1000)
                                }
                            },
                            { token: token }
                        ]
                    }
                }
            }
        });

        if (!user) {
            console.log("User not found");
            return new Response("Invalid or expired token", { status: 400 });
        }

        // Update user and token in a transaction
        await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: { isVerified: true }
            }),
            prisma.verificationToken.update({
                where: { token: token },
                data: { ActivatedAt: new Date() }
            })
        ]);

        return new Response(JSON.stringify({ 
            success: true, 
            message: "Account activated successfully" 
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error("Verification error:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error during verification" }), 
            { status: 500 }
        );
    }
}