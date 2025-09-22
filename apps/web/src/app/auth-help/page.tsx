"use client";

import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Link from "next/link";

export default function AuthHelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Authentication Help</h1>
          <p className="text-gray-600 mt-2">Troubleshooting SSO and authentication issues</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* SSO Callback Issues */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">SSO Callback 404 Error</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p><strong>Problem:</strong> Getting 404 after signing in with Google</p>
              <p><strong>Solution:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Make sure you have the SSO callback pages created</li>
                <li>Check your Clerk dashboard OAuth settings</li>
                <li>Verify redirect URLs are configured correctly</li>
                <li>Ensure environment variables are set</li>
              </ol>
            </div>
            <div className="mt-4">
              <Link href="/sign-in">
                <Button variant="outline" size="sm">
                  Try Sign In Again
                </Button>
              </Link>
            </div>
          </Card>

          {/* Environment Setup */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
            <div className="space-y-3 text-sm">
              <div className="bg-gray-100 p-3 rounded">
                <code className="text-xs">
                  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...<br/>
                  CLERK_SECRET_KEY=sk_test_...<br/>
                  GOOGLE_CLIENT_ID=your_google_id<br/>
                  GOOGLE_CLIENT_SECRET=your_google_secret
                </code>
              </div>
              <p className="text-gray-600">
                Make sure all required environment variables are set in your .env.local file
              </p>
            </div>
          </Card>

          {/* Clerk Dashboard Setup */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Clerk Dashboard Setup</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p><strong>Required Steps:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Go to your Clerk dashboard</li>
                <li>Navigate to "Authentication" → "Social Connections"</li>
                <li>Enable Google OAuth</li>
                <li>Add redirect URLs:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>http://localhost:3000/sign-in/sso-callback</li>
                    <li>http://localhost:3000/sign-up/sso-callback</li>
                  </ul>
                </li>
                <li>Copy the Google Client ID and Secret</li>
              </ol>
            </div>
          </Card>

          {/* Google Cloud Console */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Google Cloud Console</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p><strong>OAuth Setup:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Go to Google Cloud Console</li>
                <li>Create or select a project</li>
                <li>Enable Google+ API</li>
                <li>Create OAuth 2.0 credentials</li>
                <li>Add authorized redirect URIs:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>https://your-clerk-domain.clerk.accounts.dev/v1/oauth_callback</li>
                  </ul>
                </li>
              </ol>
            </div>
          </Card>

          {/* Common Issues */}
          <Card className="p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Common Issues & Solutions</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">"Invalid redirect URI"</h3>
                <p className="text-sm text-gray-600">
                  Check that your redirect URIs in Google Cloud Console match exactly with Clerk's callback URL.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">"Client ID not found"</h3>
                <p className="text-sm text-gray-600">
                  Verify your Google Client ID is correctly set in environment variables and Clerk dashboard.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">"Access blocked"</h3>
                <p className="text-sm text-gray-600">
                  Make sure your Google OAuth consent screen is configured and published.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">"Callback not found"</h3>
                <p className="text-sm text-gray-600">
                  Ensure the SSO callback pages exist at the correct paths in your Next.js app.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
