"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { ProductSchoolLogo } from "@/components/ProductSchoolLogo";

interface PasswordEntryProps {
  slug: string;
  clientName: string;
  passwordRequired: boolean;
}

export function PasswordEntry({
  slug,
  clientName,
  passwordRequired,
}: PasswordEntryProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/assessments/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Reload the page to show the iframe
        router.refresh();
      } else {
        setError(data.error || "Incorrect password. Please try again.");
        setPassword("");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <ProductSchoolLogo className="h-12 w-auto text-gray-900" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-ps-blue-50 rounded-full mb-4">
              <Lock className="h-7 w-7 text-ps-blue" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
              {clientName}
            </h2>
            {passwordRequired && (
              <p className="text-sm text-gray-600">
                Enter your access password to continue
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-ps-blue focus:border-transparent placeholder:text-gray-400"
                placeholder="Enter password"
                required
                disabled={loading}
                autoFocus
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-ps-blue text-white font-semibold rounded-md hover:bg-ps-navy transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}
              Access Assessment
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Product School. All rights reserved.
        </p>
      </div>
    </div>
  );
}
