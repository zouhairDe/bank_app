import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import generateCreditCardNumber from '@/app/api/algorithms/luhn';

const generateUniqueCreditCardNumber = async () => {
    let newCard: string;
    let cardExists: boolean;

    do {
        // Generate a new credit card number
        newCard = generateCreditCardNumber(
            Math.floor(Math.random() * 10000)
                .toString()
                .padStart(4, Math.random().toString().slice(1))
        );

        // Check if the generated card is already in the database
        const card = await prisma.creditCard.findFirst({
            where: {
                number: newCard,
            },
        });

        cardExists = !!card;
    } while (cardExists);

    return newCard;
};


export async function POST(request: Request) {
    // Check authorization
    const session = await getServerSession(authOptions);
    const { userId } = await request.json();
    
    if (!session?.user || userId !== session.user.id || !userId) {
        return new Response(
            JSON.stringify({ message: 'Unauthorized - Admin access required' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
    }

    if (session.user.creditCards.length >= 3) {
        return new Response(
            JSON.stringify({ message: 'User can only have 3 credit cards' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
    }
    
    try {
        const newCard = await generateUniqueCreditCardNumber();
        const card = await prisma.creditCard.create({
            data: {
                number: newCard,
                holder: session.user.name,
                cvv: Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
                expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                isBlocked: false,
                ownerId: session.user.id,
            },
        });
        if (!card) {
            return new Response(
                JSON.stringify({ message: 'Failed to create card' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
        console.log('Successfully created card:', card);
        return new Response(
            JSON.stringify({ message: 'Successfully created card' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (e) {
        console.error('Failed to create card:', e);
        return new Response(
            JSON.stringify({ message: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}