
import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs/server";
import CreatePost from "@/components/CreatePost";
import WhoToFollow from "@/components/WhoToFollow";
import PostCard from "@/components/PostCard";
import { getPosts } from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";



export default async function Home() {
  const user = await currentUser();
  const posts = await getPosts();
  const dbUserId = await getDbUserId();

  console.log({posts})

  

  return (
    
    <div className="m-4">
      <h1>Test home page</h1>
      {/* mode "modal" makes a popup window rather than redirecting */}
      <Button className="bg-gradient-to-r from-sky-400 to-blue-500 text-white">
        Test button for gradient
        
      </Button> 
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        <div className="lg:col-span-6">

          { user ? <CreatePost/> : null }

          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} dbUserId={dbUserId}/>
            ))}

          </div>

        </div>

          <div className="hidden lg:block lg:col-span-4 sticky top-20">
            <WhoToFollow/>
          </div>
      
      </div>
    </div>
    
  );
}
