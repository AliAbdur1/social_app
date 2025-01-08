import { clerkMiddleware } from "@clerk/nextjs/server";

// Import environment variables
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const secretKey = process.env.CLERK_SECRET_KEY;

if (!publishableKey) {
  throw new Error("Missing Clerk publishableKey. Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in your environment variables.");
}

if (!secretKey) {
  throw new Error("Missing Clerk secretKey. Set CLERK_SECRET_KEY in your environment variables.");
}

export default clerkMiddleware({
  publishableKey,
  secretKey,
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
