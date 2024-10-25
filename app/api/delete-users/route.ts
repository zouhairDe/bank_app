// pages/api/delete-users.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request) {
    try {
        const responde = await prisma.user.deleteMany({});
        return new Response(
            JSON.stringify({ message: responde }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    }
    catch (error) {
        console.error('Failed to delete users:', error);
        return new Response(
            JSON.stringify({ message: 'Internal server error' }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}