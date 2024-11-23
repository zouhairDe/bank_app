import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export async function DELETE(request: Request) {
    try {
        // Check authorization
        const session = await getServerSession(authOptions);
        
        if (!session?.user || ["ADMIN", "tester"].includes(session.user.role) === false) {
            return new Response(
                JSON.stringify({ message: 'Unauthorized - Admin access required' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Use transaction to ensure all or nothing deletion
        const result = await prisma.$transaction(async (tx) => {
            // Delete in correct order to respect foreign key constraints
            const deletedTransactions = await tx.transaction.deleteMany();
            const deletedCards = await tx.creditCard.deleteMany();
            const deletedTokens = await tx.verificationToken.deleteMany();
            const deletedUsers = await tx.user.deleteMany();

            return {
                creditCards: deletedCards.count,
                verificationTokens: deletedTokens.count,
                users: deletedUsers.count,
                transactions: deletedTransactions.count
            };
        });

        return new Response(
            JSON.stringify({
                message: 'Successfully deleted records',
                deletedCounts: result
            }),
            { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error: any) {
        console.error('Database operation failed:', error);
        
        return new Response(
            JSON.stringify({
                message: 'Internal server error\n',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            }),
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}