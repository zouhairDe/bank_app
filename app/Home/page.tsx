"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/ui/Loading";
import InfiniteScroll from 'react-infinite-scroll-component';

export interface Post {
	id: string;
	content: string;
	userId: number;
	createdAt: string;
	upvotes: number;
	downvotes: number;
  }
  

const Home = () => {
	const { data: session, status } = useSession();
	const router = useRouter();

	const [posts, setPosts] = useState<Post[]>([]);
	const [hasMore, setHasMore] = useState(true);
	const [postsNumber, setPostsNumber] = useState(10);
	const [loading, setLoading] = useState(false);
	const [upVotedPosts, setUpVotedPosts] = useState(false);
	const [downVotedPosts, setDownVotedPosts] = useState(false);

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/");
		}
	}, [status, router]);

	useEffect(() => {
		fetchPosts();
	}, [postsNumber]);

	const fetchPosts = async () => {
		setLoading(true);
		try {
		  const response = await fetch(`/api/posts?limit=${postsNumber}`, {
			method: "GET",
			headers: {
			  "Content-Type": "application/json",
			},
		  });
		  const data: Post[] = await response.json();
		  console.log("Fetched Posts:", data);  // Add this line
		  if (data.length < postsNumber) {
			setHasMore(false);
		  }
		  console.log("Posts:", data);
		  setPosts(data);
		} catch (error) {
		  console.error("Error fetching posts:", error);
		} finally {
		  setLoading(false);
		}
	  };
	  

	const fetchMorePosts = async () => {
		if (loading || !hasMore) return;

		setLoading(true);
		try {
			const response = await fetch(`/api/posts?limit=${postsNumber}&offset=${posts.length}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data: Post[] = await response.json();
			setPosts((prevPosts) => [...prevPosts, ...data]);
			if (data.length < postsNumber) {
				setHasMore(false);
			}
		} catch (error) {
			console.error("Error fetching more posts:", error);
		} finally {
			setLoading(false);
		}
	};

	if (status === "loading" || status === "unauthenticated") {
		return <Loading />;
	}
	
	const handleVote = async (postId: string, type: 'upvote' | 'downvote', action: 'increment' | 'decrement') => {
		if (type === 'upvote') {
			if (upVotedPosts) {
				// Already upvoted
				return;
			}
			if (downVotedPosts) {
				// Undo downvote
				setDownVotedPosts(false);
				await handleVote(postId, 'downvote', 'increment');
			}
			setUpVotedPosts(true);
		} else if (type === 'downvote') {
			if (downVotedPosts) {
				// Already downvoted
				return;
			}
			if (upVotedPosts) {
				// Undo upvote
				setUpVotedPosts(false);
				await handleVote(postId, 'upvote', 'increment');
			}
			setDownVotedPosts(true);
		}
	
		try {
			const response = await fetch(`/api/votes?postId=${postId}&type=${type}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ action }),
			});
			const data: Post = await response.json();
			setPosts((prevPosts) => prevPosts.map((post) => (post.id === postId ? data : post)));
		} catch (error) {
			console.error("Error voting post:", error);
		}
	}
	
	

	return (
		<div className="h-full w-full text-white">
			<InfiniteScroll
				dataLength={posts.length}
				next={fetchMorePosts}
				hasMore={hasMore}
				loader={<h4>Loading...</h4>}
				endMessage={
					<p style={{ textAlign: 'center' }}>
						<b>No More Posts to show!</b>
					</p>
				}
			>
				{posts.map((post) => (
					<div key={post.id} className="post bg-gray-800 p-4 mb-4 rounded-lg">
						<p className="text-gray-300 mb-2">{post.content}</p>
						<div className="flex items-center">
							<button onClick={() => handleVote(post.id, 'upvote', 'increment')} className="bg-green-500 text-white px-2 py-1 rounded mr-2">
								Upvote
							</button>
							<span className="text-white mr-2">{post.upvotes}</span>
							<button onClick={() => handleVote(post.id, 'downvote', 'decrement')} className="bg-red-500 text-white px-2 py-1 rounded mr-2">
								Downvote
							</button>
							<span className="text-white">{post.downvotes}</span>
						</div>
					</div>
				))}
			</InfiniteScroll>
		</div>
	);
};

export default Home;