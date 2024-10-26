import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const responde = await prisma.user.findMany({});
        // const money = await prisma.user.update({
        //     where: { email: "zouddach@student.1337.ma" },
        //     data: {
        //         balance: 70000,
        //     }
        // });
        // console.log('Successfully listed:', money);
        return new Response(
            JSON.stringify({ message: responde }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
        //give my account more money
    }
    catch (error) {
        console.error('Failed to list users:', error);
        return new Response(
            JSON.stringify({ message: 'Internal server error' }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}