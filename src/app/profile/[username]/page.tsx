import React from 'react'
import ProfilePageClient from './ProfilePageClient'
import { getProfileByUsername, getUserLikedPosts, getUserPosts, isFollowing } from '@/actions/profile.action';
import { notFound } from 'next/navigation';

export async function generateMetadata({params}: {params: {username: string}}) {
    const user = await getProfileByUsername(params.username);

    if(!user) return;

    return {
        title: `${user.name ?? user.username}`,
        description: user.bio || `Check out ${user.username}'s profile.`,
    }
}

async function ProfilePageServer({params}: {params: {username: string}}) {

    const user = await getProfileByUsername(params.username);

    if(!user) notFound();

    const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
        getUserPosts(user.id),
        getUserLikedPosts(user.id),
        isFollowing(user.id),
        

    ])

    // await new Promise((resolve) => setTimeout(resolve, 2000));
  return (
    <ProfilePageClient
    user={user}
    posts={posts}
    LikedPosts={likedPosts}
    isFollowing={isCurrentUserFollowing}
    />
  )
}

export default ProfilePageServer
