import ModeToggle from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="m-4">

      <h1>Test home page</h1>
      {/* mode "modal" makes a popup window rather than redirecting */}
      <Button className="bg-gradient-to-r from-sky-400 to-blue-500 text-white">
        Test button for gradient
      </Button> 
    </div>
  );
}
