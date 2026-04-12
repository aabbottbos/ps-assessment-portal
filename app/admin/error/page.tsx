"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Unauthorized</h2>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <p className="text-gray-700 mb-6">
            {error === "AccessDenied"
              ? "You must use a @productschool.com email address to access the admin portal."
              : "An error occurred during sign in. Please try again."}
          </p>

          <Link
            href="/admin/signin"
            className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm bg-primary-600 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
