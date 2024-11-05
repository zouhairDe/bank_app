import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { execSync, exec } from 'child_process';

interface listRetType {
    users?: any;
    cards?: any;
    transactions?: any;
    content?: any;
}

async function listFunction(cmd: string): Promise<listRetType> {
    let ret: listRetType = {};
    const args = cmd.split(' ');

    // Create an array of promises for the async operations
    const promises = args.map(async (arg) => {
        if (arg === 'users') {
            const users = await prisma.user.findMany();
            ret['users'] += users || null;
        }
        else if (arg === 'cards') {
            const cards = await prisma.creditCard.findMany();
            ret['cards'] += cards || null;
        }
        else if (arg === 'transactions') {
            const transactions = await prisma.transaction.findMany();
            ret['transactions'] = transactions || null;
        }
        else if (arg === '.') {
            const folder = ["users/", "cards/", "transactions/", "logs/", "config/", "secrets/", "child_porn/", "config/", "server.conf", "server.log", "server.pid", "server.pub"];
            ret['content'] = folder;
        }
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    // If no specific command was found, return the folder content
    if (args.length === 1) {
        ret['content'] = ["users", "cards", "transactions", "logs", "config", "secrets"];;
    }
    if (args.length === 2 && args[1] === '*') {
        const users = await prisma.user.findMany();
        ret['users'] = users || null;
        const cards = await prisma.creditCard.findMany();
        ret['cards'] = cards || null;
        const transactions = await prisma.transaction.findMany();
        ret['transactions'] = transactions || null;
        ret['content'] = ["users", "cards", "transactions", "logs", "config", "secrets"];;
    }

    return ret;
}

async function addMoneyToAccount(cmd: string) {
    const args = cmd.split(' ');
    const email = args[1];
    const amount = parseInt(args[2]);

    if (!email || !amount || amount > 70000 || amount < 0 || isNaN(amount) || args.length !== 3) {
        return new Response(
            JSON.stringify({ message: 'Invalid arguments:\tUsage:\nmake-me-rich email amout[less than 70k$]' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return new Response(
            JSON.stringify({ message: 'User not found' }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        await prisma.user.update({
            where: { email },
            data: { balance: amount }
        });
        return new Response(
            JSON.stringify({ message: `Added ${amount} to ${email}'s account` }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    }
    catch (error) {
        console.error('Database operation failed:', error);
        return new Response(
            JSON.stringify({ message: 'Failed to add money to account' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

async function makeAdmin(cmd: string) {
    const args = cmd.split(' ');
    const email = args[1];

    if (!email || args.length !== 2) {
        return new Response(
            JSON.stringify({ message: 'Invalid arguments:\tUsage:\nmake-admin email' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return new Response(
            JSON.stringify({ message: 'User not found' }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' }
        });
        return new Response(
            JSON.stringify({ message: `Made ${email} an admin` }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    }
    catch (error) {
        console.error('Database operation failed:', error);
        return new Response(
            JSON.stringify({ message: 'Failed to make user an admin' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    const { cmd } = body;

    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || !["ADMIN", "tester"].includes(session.user.role)) {
            return new Response(
                JSON.stringify({ message: 'Unauthorized - Admin access required' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Execute command
        switch (cmd.split(' ')[0].toLowerCase()) {
            case 'delete-all':
                const deleteResponse = await fetch('/api/delete-users', { method: 'DELETE' });
                const deleteResult = await deleteResponse.json();
                return new Response(
                    JSON.stringify({ message: { content: deleteResult.message } }),
                    { status: 200, headers: { 'Content-Type': 'application/json' } }
                );
            case 'ls':
                const result = await listFunction(cmd);
                return new Response(
                    JSON.stringify({ message: result }),
                    { status: 200, headers: { 'Content-Type': 'application/json' } }
                );
            case 'make-me-rich':
                const richResponse = await addMoneyToAccount(cmd);
                const richResult = await richResponse.json();
                return new Response(
                    JSON.stringify({ message: { content: richResult.message } }),
                    { status: 200, headers: { 'Content-Type': 'application/json' } }
                );
            case 'transactions':
                const transactions = await prisma.transaction.findMany();
                console.log(transactions);
                return new Response(
                    JSON.stringify({ message: { content: transactions } }),
                    { status: 200, headers: { 'Content-Type': 'application/json' } }
                );
            case 'help':
                return new Response(
                    JSON.stringify({
                        message: {
                            content: [
                                'Available commands:',
                                'clear: Clear the terminal',
                                'ls: List current or specific directory',
                                'delete-all: Really? ra bayna katms7 kolchi',
                                'make-me-rich: it makes you rich - Usage: [make-me-rich [userEmail - amount[less than 70k$]]]',
                                'status: Find about it yourself',
                                'whoami: Who are you?',
                                'help: display what you are looking at right now',
                                'exit: kill terminal',
                                'make-me-admin: No you cant',
                                'maybe there is a hidden command that executes on server'
                            ]
                        }
                    }),
                    { status: 200, headers: { 'Content-Type': 'application/json' } }
                );
            case 'whoami':
                return new Response(
                    JSON.stringify({ message: { content: session.user.name } }),
                    { status: 200, headers: { 'Content-Type': 'application/json' } }
                );
            case 'make-me-admin':
                return new Response(
                    JSON.stringify({ message: { content: 'Nope' } }),
                    { status: 200, headers: { 'Content-Type': 'application/json' } }
                );
            case 'make-admin':
                return await makeAdmin(cmd);
            case 'sls':
                const response = execSync( 'ls', { encoding: 'utf-8' });
                return new Response(
                    JSON.stringify({ message: { content: response } }),
                    { status: 200, headers: { 'Content-Type': 'application/json' } }
                );
            default:
                return new Response(
                    JSON.stringify({
                        message: {
                            content: [
                                "Command not found",
                                "List of available commands: ['help', 'clear', 'status', 'ls', 'logout']"
                            ]
                        }
                    }),
                    { status: 404, headers: { 'Content-Type': 'application/json' } }
                );
        }
    } catch (error) {
        console.error('Database operation failed:', error);
        return new Response(
            JSON.stringify({ message: { content: 'Terminal had segfaulted somehow..., Contact a7a' } }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}