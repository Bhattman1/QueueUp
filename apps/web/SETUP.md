# QueueUp Setup Guide

## Quick Fix for Convex Connection Error

The error you're seeing means Convex isn't running or connected properly. Here's how to fix it:

### Step 1: Start Convex Development Server

Open a terminal in the web app directory and run:

```bash
cd apps/web
npx convex dev
```

This will:
- Start the Convex development server
- Deploy your functions to Convex
- Generate the API files
- Show you the deployment URL

### Step 2: Update Environment Variables

After running `npx convex dev`, you'll see output like:

```
Deployment URL: https://your-deployment.convex.cloud
```

Copy this URL and create/update your `.env.local` file:

```bash
# Create .env.local file
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
```

### Step 3: Restart Next.js

After updating the environment variables, restart your Next.js development server:

```bash
npm run dev
```

### Step 4: Test the Connection

1. Go to `http://localhost:3000/debug-user`
2. Check if you can see your user data
3. If connected, you'll see "Synced: Yes" in the Convex User Info section

### Troubleshooting

**If you still get the error:**
1. Make sure `npx convex dev` is running
2. Check that the deployment URL in `.env.local` matches what Convex shows
3. Restart both Convex (`npx convex dev`) and Next.js (`npm run dev`)

**If you see "Could not find public function":**
- The Convex functions aren't deployed yet
- Wait for `npx convex dev` to finish deploying
- Check the terminal output for any errors

### Next Steps

Once Convex is connected:
1. Go to `/debug-user` to check your status
2. Make yourself an admin if needed
3. Access `/admin` to manage restaurants
