"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { get } from "http";
import { revalidatePath } from "next/cache";


export async function syncUser() {
    try {
        const {userId} = await auth()
        const user = await currentUser();

        if(!userId || !user) return;
        // check if user exists

        const existingUser = await prisma.user.findUnique({
            where: {
                clerkId: userId
            }
        })

        if (existingUser) return existingUser;

        const dbUser = await prisma.user.create({
            data:{
                clerkId:userId,
                name: `${user.firstName || ""} ${user.lastName || ""}`,
                // the below line of code grabs the user name by splitting the email address at the @ symbol
                username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
                email: user.emailAddresses[0].emailAddress,
                image: user.imageUrl,


            }
        })

        return dbUser;

    } catch (error) {
        console.log("error syncing user", error)

    }
} 

export async function getUserByClerkId(clerkId: string) {
    return prisma.user.findUnique({
        where: {
            clerkId,
        },
        include: {
            _count: {
                select: {
                    followers: true,
                    following: true,
                    posts: true, // come back to this.. will try to change from post to posts later
                },
            },
        },
    });
}
export async function getDbUserId() {
    const {userId:clerkId} = await auth();
    // clerk id is needed to get DB user id
    if(!clerkId) return null;

    const user = await getUserByClerkId(clerkId);

    if(!user) throw new Error("user not found");

    return user.id
}

export async function getRandomUsers() {
    try {
        const userId = await getDbUserId();

        if(!userId) return [];
        const randomUsers = await prisma.user.findMany({
            where: {
                AND: [
                    {NOT: {id: userId}},
                    {
                        NOT: {
                            followers: {
                                some: {
                                    followerId: userId
                                }
                            }
                        }
                    },
                ]
            },
            select: {
                id: true,
                name: true,
                username: true,
                image: true,
                _count: {
                    select: {
                        followers: true,
                    }
                }
            },
            take: 3,
        })

        return randomUsers;

    } catch (error) {
        console.log("error getting random users", error);
        return [];

    }
}

export async function toggleFollow(targetUserId: string) {
    try {
        const userId = await getDbUserId();

        if(!userId) return;

        if(userId === targetUserId) throw new Error("cannot follow yourself");
        const existingFollow = await prisma.follows.findUnique({
            where: {
                followerId_followingId: {
                    followerId: userId,
                    followingId: targetUserId,
                }
            }
            
        })

        if(existingFollow) {
            await prisma.follows.delete({
                where: {
                    followerId_followingId: {
                        followerId: userId,
                        followingId: targetUserId,
                    }
                }
            })
        } else {
            await prisma.$transaction([
                prisma.follows.create({
                    data: {
                        followerId: userId,
                        followingId: targetUserId,
                    }
                }),
                prisma.notification.create({
                    data: {
                        type: "FOLLOW",
                        userId: targetUserId,
                        creatorId: userId
                    }
                })
            ])

        }

        revalidatePath("/"); // returns to home page after user is followed
        return{success: true};
    } catch (error) {
        console.log("error following user", error)
        return {success: false, error: "Error toggling follow user"};
        
    }
}