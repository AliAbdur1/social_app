"use client"
import { Button } from './ui/button'
import { useState } from 'react'
import { Loader2Icon } from 'lucide-react'
import { toggleFollow } from '@/actions/user.action'
import React from 'react'
import toast from 'react-hot-toast'

function FollowButton({userId}: {userId: string}) {
    const [isLoading, setIsLoading] = useState(false);


    const handleFollow = async () => {
        setIsLoading(true);
        try {
            await toggleFollow(userId);
            toast.success("Successfully followed the user");

        } catch (error) {
            console.log("Error following the user",error);
            toast.error("Error following the user");

        }finally {
            setIsLoading(false);
        }
    };
        
    
    return (
        <Button
        size={"sm"}
        variant={"secondary"}
        onClick={handleFollow}
        disabled={isLoading}
        className="w-20"
        >
            {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : "Follow"}
            </Button>
    )
}

export default FollowButton
