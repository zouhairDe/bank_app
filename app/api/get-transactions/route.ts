import { getServerSession } from "next-auth";
import { prisma } from "../../../lib/prisma";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Get URL parameters
        const { searchParams } = new URL(request.url);
        const limit = Number(searchParams.get('limit')) || 10;
        const userId = session.user.id;

        // Fetch all transactions where the user is either sender or receiver
        const transactions = await prisma.transaction.findMany({
            where: {
                OR: [
                    { userId: userId },
                    { receiverId: userId }
                ]
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                },
                receiver: {
                    select: {
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        });

        // Process transactions to add context and status
        const processedTransactions = transactions.map(transaction => {
            const isSender = transaction.userId === userId;
            return {
                id: transaction.id,
                amount: transaction.amount,
                timestamp: transaction.createdAt,
                type: isSender ? 'sent' : 'received',
                status: 'completed', // All fetched transactions are completed
                party: isSender 
                    ? {
                        name: transaction.receiver.name,
                        email: transaction.receiver.email,
                      }
                    : {
                        name: transaction.user.name,
                        email: transaction.user.email,
                      }
            };
        });

        return NextResponse.json({ transactions: processedTransactions });
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        return NextResponse.json(
            { message: 'Failed to fetch transactions' },
            { status: 500 }
        );
    }
}
