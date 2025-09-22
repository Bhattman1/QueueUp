"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { UserButton } from "@clerk/nextjs";

export function Navigation() {
  const { user, isSignedIn } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              QueueUp
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                {/* Role-based navigation */}
                {currentUser?.role === "admin" && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
                
                {(currentUser?.role === "restaurant_owner" || currentUser?.role === "admin") && (
                  <>
                    <Link href="/restaurant-owner">
                      <Button variant="outline" size="sm">
                        Restaurant Dashboard
                      </Button>
                    </Link>
                    <Link href="/console">
                      <Button variant="outline" size="sm">
                        Console
                      </Button>
                    </Link>
                  </>
                )}

                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/sign-in">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
