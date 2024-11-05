import { getServerSession } from "next-auth";
import { prisma } from "../../../lib/prisma";
import { cookies } from 'next/headers'
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { sender, amount, recipient } = await request.json();
        const session = await getServerSession(authOptions);

        if (session?.user.id == null || session?.user.id != sender) {
            return new Response(
                JSON.stringify({ message: 'User not authenticated' }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (sender != null && amount != null && recipient != null) {
            const senderUser = await prisma.user.findUnique({
                where: { id: sender }
            });
            const recipientUser = await prisma.user.findUnique({
                where: { email: recipient }
            });
            if (!senderUser) {
                return new Response(
                    JSON.stringify({ message: 'Sender not found' }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }
            if (!recipientUser) {
                return new Response(
                    JSON.stringify({ message: 'Recipient not found' }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }
            if (senderUser.balance < amount) {
                return new Response(
                    JSON.stringify({ message: 'Insufficient funds' }),
                    { status: 400, headers: { "Content-Type": "application/json" } }
                );
            }
            await prisma.$transaction([
                prisma.user.update({
                    where: { id: sender },
                    data: { balance: senderUser.balance - amount }
                }),
                prisma.user.update({
                    where: { email: recipient },
                    data: { balance: recipientUser.balance + amount }
                }),
                prisma.transaction.create({
                    data: {
                        amount,
                        userId: senderUser.id,
                        receiverId: recipientUser.id,
                    },
                })
            ]);
            return new Response(
                JSON.stringify({ message: 'Transaction successful' }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        } else {
            return new Response(
                JSON.stringify({ message: 'Missing required fields' }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ message: 'Failed to process transaction' }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}