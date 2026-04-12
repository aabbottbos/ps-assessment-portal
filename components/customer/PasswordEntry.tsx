"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ProductSchoolLogo } from "@/components/ProductSchoolLogo";
import Image from "next/image";

interface PasswordEntryProps {
  slug: string;
  clientName: string;
  passwordRequired: boolean;
  type: "assessment" | "proposal";
  logoUrl: string | null;
}

export function PasswordEntry({
  slug,
  clientName,
  passwordRequired,
  type,
  logoUrl,
}: PasswordEntryProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isProposal = type === "proposal";
  const itemTypeName = isProposal ? "Proposal" : "Assessment";

  // Auto-submit for public assessments
  useEffect(() => {
    if (!passwordRequired) {
      handleSubmit();
    }
  }, [passwordRequired]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/assessments/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug, password: passwordRequired ? password : "" }),
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

  // Show loading state for public assessments/proposals
  if (!passwordRequired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0] px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-12">
            <div className="text-center space-y-6">
              <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto" />
              <p className="text-base text-gray-600">
                Loading {itemTypeName.toLowerCase()}...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0] px-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-12">
          {/* Product School Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <ProductSchoolLogo className="h-16 w-auto text-gray-900" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Product School
            </h1>
          </div>

          {/* Divider */}
          <div className="w-16 h-px bg-gray-300 mx-auto mb-8"></div>

          {/* Confidential Text */}
          <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-wide mb-6">
            CONFIDENTIAL {itemTypeName.toUpperCase()} FOR
          </p>

          {/* Client Logo */}
          {logoUrl && (
            <div className="flex justify-center mb-8">
              <div className="relative w-48 h-24">
                <Image
                  src={logoUrl}
                  alt={clientName}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-8">
            <div>
              <label htmlFor="password" className="sr-only">
                Access Code
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 border border-gray-300 rounded-xl text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent placeholder:text-gray-400"
                placeholder="Enter access code"
                required
                disabled={loading}
                autoFocus
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#1E3A5F] text-white text-base font-semibold rounded-xl hover:bg-[#152D4A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}
              Access {itemTypeName}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
