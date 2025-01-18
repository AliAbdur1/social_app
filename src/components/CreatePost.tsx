"use client"
import React from 'react'
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { CardContent, Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Loader2Icon } from 'lucide-react';
import { SendIcon } from 'lucide-react';
import { ImageIcon } from 'lucide-react';
import { createPost } from '@/actions/post.action';
import toast from 'react-hot-toast';

function CreatePost() {
    const {user}= useUser();
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [showImageUpload, setShowImageUpload] = useState(false);

    const handleSubmit = async () => {
        if(!content.trim() && !imageUrl) return; // if there is no content or image, simply return

        setIsPosting(true);
        try {
          const result = await createPost(content, imageUrl); // server action
          if(result.success){
            // reset the form
            setContent('');
            setImageUrl('');
            setShowImageUpload(false);

            console.log("result",result)
            toast.success('Successfully posted!', {
              style: {
                background: '#333',
                color: '#fff',
              },
            });
            
          }

        }catch (error) {
          console.log("an error took place",error)
          toast.error("Something went wrong");
          

        }finally{
            setIsPosting(false);
          }
    };
  return (
    <div>
        <Card className="mb-6">
            <CardContent className='pt-6'>
                <div className="space-y-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.imageUrl || "/avatar.png"} />
                  </Avatar>
                  <Textarea
                    placeholder="What's on your mind?"
                    className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base"
                    value={content} // the content of the post
                    onChange={(e) => setContent(e.target.value)} // updates the state
                    disabled={isPosting} // disable while posting
                  />
                    
                </div>
                {/* todo hadle image upload */}

                <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary"
                        onClick={() => setShowImageUpload(!showImageUpload)}
                        disabled={isPosting}
                      >
                        <ImageIcon className="size-4 mr-2" />
                        Photo
                      </Button>
                    </div>
                    <Button
                    className="flex items-center"
                    onClick={handleSubmit}
                    disabled={(!content.trim() && !imageUrl) || isPosting}
                    >
                    {isPosting ? (
                    <>
                      <Loader2Icon className="size-4 mr-2 animate-spin" />
                      Posting...
                    </>
                    ) : (
                    <>
                      <SendIcon className="size-4 mr-2" />
                      Post
                    </>
                    )}
                    </Button>
                </div>

            </CardContent>

        </Card>
      
    </div>
  )
}

export default CreatePost
