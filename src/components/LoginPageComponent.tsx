"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import TestComponent from "./TestComponent";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
   // 👇 keep error in sync with query param
  useEffect(() => {
    if (urlError) {
      setError(urlError);
    }
  }, [urlError]);
  const onLogin = async () => {
    setError(null);

    if (!user.email || !user.password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const result = await signIn("email-password", {
        email: user.email,
        password: user.password,
        redirect: false, // handle navigation manually to show errors
        callbackUrl: "/profile",
      });

      setLoading(false);

      if (result?.error) {
        // Surface NextAuth or Firebase error messages
        setError(result.error);
        return;
      }

      // Success: navigate to callbackUrl (NextAuth returns it in result.url)
      if (result?.ok) {
        router.push(result.url ?? "/profile");
      }
    } catch (e: any) {
      setLoading(false);
      setError(e?.message || "Login failed. Please try again.");
    }
  };
  // 👇 helper map for cleaner error messages
  const errorMessages: Record<string, string> = {
    NOT_REGISTERED: "You are not registered. Please sign up first.",
    
  };

  return (
    <div className="flex flex-col py-2 justify-center items-center min-h-screen border p-4 rounded-lg shadow-lg max-w-md mx-auto bg-gray-500">
     <TestComponent/>
        {error && (
        <div className="mb-4 rounded bg-red-100 text-red-700 px-3 py-2 text-sm">
          {errorMessages[error] ?? error}
        </div>
      )}
        <label htmlFor="email" className="block mb-1 text-sm font-medium text-black">
          Email
        </label>
        <input
          className="border-2 border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          type="email"
          id="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="email@example.com"
          autoComplete="email"
        />

        <label htmlFor="password" className="block mb-1 text-sm font-medium text-black">
          Password
        </label>
        <input
          className="border-2 border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          type="password"
          id="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Your password"
          autoComplete="current-password"
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={onLogin}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <div className="mt-3 text-center">
          <Link
            href="/signup"
            className="text-sm text-black hover:underline"
          >
            Don&apos;t have an account? Sign up
          </Link>
        </div>
        <div >
          <h1 className="flex text-center justify-center mt-2 text-xl">or</h1>
          <div>
            <button 
            className="text-sm text-black hover:underline"
            onClick={()=>signIn("google",{callbackUrl:"/profile"})}>
              Signin with google
            </button>
          </div>
        </div>
      </div>

  );
}