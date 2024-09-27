import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: Request) {

	const url = new URL(request.url);
	const limit = Number(url.searchParams.get('limit')) || 10;
	const offset = Number(url.searchParams.get('offset')) || 0;
	
	// if (limit < 0 || offset < 1 || limit + 20 < offset || limit > 20) {
	// 	return new Response(JSON.stringify({ message: 'Unauthorized' }), {
	// 		status: 400,
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 		},
	// 	});
	// }

	const posts = await prisma.posts.findMany({
		skip: offset,
		take: limit,
		orderBy: {
			createdAt: 'desc',
		},
		where: {
			isApproved: true,
		},
	});
	
	if (!posts) {
		return new Response(JSON.stringify(null), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	console.log('Posts:', posts);		

	return new Response(JSON.stringify(posts), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
}