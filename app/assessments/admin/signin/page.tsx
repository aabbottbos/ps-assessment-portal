import { signIn } from "@/lib/auth";
import { ProductSchoolLogo } from "@/components/ProductSchoolLogo";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-8">
            <ProductSchoolLogo className="h-12 w-auto text-gray-900" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
            Assessments Portal
          </h1>
          <p className="text-base text-gray-600">Sign in to access the admin dashboard</p>
        </div>

        <div className="bg-white py-10 px-8 shadow-sm rounded-xl border border-gray-200">
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/assessments/admin" });
            }}
          >
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-3 py-3.5 px-4 border border-gray-300 rounded-md bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>
          </form>

          <p className="mt-4 text-xs text-center text-gray-500">
            Only @productschool.com accounts are allowed
          </p>
        </div>
      </div>
    </div>
  );
}
