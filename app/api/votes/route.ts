import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function PUT(request: Request) {
    try {
        // Extract query parameters
        const url = new URL(request.url);
        const type = url.searchParams.get('type'); // 'upvote' or 'downvote'
        const postId = url.searchParams.get('postId'); // Post ID

        // Validate input
        if (!type || !postId || !['upvote', 'downvote'].includes(type)) {
            return new Response(
                JSON.stringify({ message: 'Invalid parameters' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Extract request body
        const { action, userId } = await request.json();
        if (!action || !['increment', 'decrement'].includes(action)) {
            return new Response(
                JSON.stringify({ message: 'Invalid action or userId' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Retrieve the post
        const post = await prisma.posts.findUnique({
            where: { id: postId },
        });

        if (!post) {
			console.log("Errorrrrrrrrrrrrrrrrrrrrr");
            return new Response(
                JSON.stringify({ message: 'Post not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Determine the new values for upvotes or downvotes
        const updatedPost = await prisma.posts.update({
            where: { id: postId },
            data: {
                upvotes: type === 'upvote' 
                    ? (action === 'increment' ? post.upvotes + 1 : Math.max(0, post.upvotes - 1)) 
                    : post.upvotes,
                downvotes: type === 'downvote' 
                    ? (action === 'increment' ? post.downvotes + 1 : Math.max(0, post.downvotes - 1)) 
                    : post.downvotes,
            },
        });

        // Return the updated post
        return new Response(JSON.stringify(updatedPost), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error handling vote:', error);
        return new Response(
            JSON.stringify({ message: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
