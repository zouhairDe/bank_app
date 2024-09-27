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

		// Check if the user has already voted
		const userVotes = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				upVotes: true,
				downVotes: true
			}
		});

		if (userVotes === null) {//should update the vote
			return new Response(
				JSON.stringify({ message: 'User not found' }),
				{ status: 404, headers: { 'Content-Type': 'application/json' } }
			);
		}

		const hasUpvoted = userVotes?.upVotes.includes(postId);
		const hasDownvoted = userVotes?.downVotes.includes(postId);

		// Update the user's votes
		if (type === 'upvote') {
			if (hasUpvoted) {
				return new Response(
					JSON.stringify({ message: 'Already upvoted' }),
					{ status: 400, headers: { 'Content-Type': 'application/json' } }
				);
			}

			if (hasDownvoted) {
				await prisma.user.update({
					where: { id: userId },
					data: {
						upVotes: {//should add the user id to the upvotes
							set: [...userVotes.upVotes.filter((id) => id !== postId)]
						},
						downVotes: {
							set: [...userVotes.downVotes.filter((id) => id !== postId)]
						}
					}
				});
				//update the post votes
			} else {
				await prisma.user.update({
					where: { id: userId },
					data: {
						upVotes: {
							set: [...userVotes.upVotes, postId]
						}
					}
				});
			}
			await prisma.posts.update({
				where: { id: postId },
				data: {
					upvotes: {//should add the user id to the upvotes
						set: [...post.upvotes, userId]
					},
				}
			});
		} else if (type === 'downvote') {
			if (hasDownvoted) {
				return new Response(
					JSON.stringify({ message: 'Already downvoted' }),
					{ status: 400, headers: { 'Content-Type': 'application/json' } }
				);
			}
			
			if (hasUpvoted) {
				await prisma.user.update({
					where: { id: userId },
					data: {
						upVotes: {
							set: [...userVotes.upVotes.filter((id) => id !== postId)]
						},
						downVotes: {
							set: [...userVotes.downVotes.filter((id) => id !== postId)]
						}
					}
				});
				//update the post votes
				await prisma.posts.update({
					where: { id: postId },
					data: {
						upvotes: {//should add the user id to the upvotes
							set: [...post.upvotes.filter((id) => id !== userId)]
						},
						downvotes: {//should add the user id to the upvotes
							set: [...post.downvotes, userId]
						},	
					}
				});
			} else {
				await prisma.user.update({
					where: { id: userId },
					data: {
						downVotes: {
							set: [...userVotes.downVotes, postId]
						}
					}
				});
			}
		}
		
		const updatedPost = await prisma.posts.findUnique({
			where: { id: postId },
			select: {
				upvotes: true,
				downvotes: true
			}
		});

		// Return the updated post
		return new Response(JSON.stringify({ 
			message: 'Vote successful', 
			upvotes: updatedPost?.upvotes.length,  // Count of upvotes
			downvotes: updatedPost?.downvotes.length // Count of downvotes
		}), {
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
