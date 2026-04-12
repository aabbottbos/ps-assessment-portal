import { auth, signOut } from "@/lib/auth";
import { Toaster } from "sonner";
import { LogOut } from "lucide-react";
import { ProductSchoolLogo } from "@/components/ProductSchoolLogo";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50">
      {session && (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <ProductSchoolLogo className="h-10 w-auto" />
                <span className="text-gray-300">|</span>
                <span className="text-sm font-bold tracking-widest text-gray-700 uppercase">
                  Admin Portal
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-500">{session.user?.email}</div>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/admin/signin" });
                }}
              >
                <button
                  type="submit"
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors border border-gray-200 px-3 py-1.5 rounded-md hover:border-gray-300"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </header>
      )}

      <main className="pb-12">{children}</main>
      <Toaster position="top-right" richColors />
    </div>
  );
}
