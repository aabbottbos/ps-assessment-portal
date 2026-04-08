import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { LogOut } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // For signin and error pages, don't check auth
  // (middleware will handle redirects for other routes)
  const publicAdminRoutes = ["/assessments/admin/signin", "/assessments/admin/error"];

  return (
    <div className="min-h-screen bg-gray-50">
      {session && (
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-primary-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PS</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    PS Assessments Portal
                  </h1>
                  <p className="text-xs text-gray-500">Admin Dashboard</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-700">{session.user?.email}</div>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/assessments/admin/signin" });
                  }}
                >
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </form>
              </div>
            </div>
          </div>
        </header>
      )}

      <main>{children}</main>
      <Toaster position="top-right" />
    </div>
  );
}
