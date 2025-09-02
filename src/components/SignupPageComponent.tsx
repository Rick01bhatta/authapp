"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {GoogleAuthProvider,signInWithPopup} from 'firebase/auth';
import {auth} from "@/dbConfig/dbConfig"

export default function SignPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
    });
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const onSignUP = async () => {
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email, password: user.password }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Signup successful");
                setUser({ email: "", password: "" });
                router.push("/login");
            } else {
                console.log("Signup error response:", data);
                toast.error(data?.message ?? "Signup failed. Please try again.");
            }
        } catch (error) {
            console.log("Signup failed", error);
            toast.error("Signup failed. Please try again.");
        }
    };
    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);
    const handleGoogleSignUP =async()=>{
        try {
            const provider=new GoogleAuthProvider();
            // 1. Sign in with Google using Firebase 
            const result= await signInWithPopup(auth,provider);
            const user=result.user; 
        await fetch("/api/firebase-signup", 
        { method: "POST", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ 
            email: user.email, 
            name: user.displayName, 
            picture: user.photoURL, }), 
        }); 
        router.push("/login");
        } catch (error: any) {
    switch (error) {
  case "EMAIL_ALREADY_REGISTERED":
    toast.error("This email is already registered. Please login instead.");
    break;
  case "auth/account-exists-with-different-credential":
    toast.error("An account already exists with the same email using another method.");
    break;
  case "NOT_REGISTERED":
    toast.error("No account found. Please sign up first.");
    break;
  default:
    toast.error("Something went wrong.");
}

  }
}

    return (
        <div className="flex flex-col py-2 justify-center items-center min-h-screen border p-4 rounded-lg shadow-lg max-w-md mx-auto bg-gray-500">
            
            <label htmlFor="email">Email</label>
            <input
                className="border-2 border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                type="email"
                id="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Enter Email"
            />
            <label htmlFor="password">Password</label>
            <input
                className="border-2 border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                type="password"
                id="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="Enter Password"
            />
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={onSignUP}
                disabled={buttonDisabled}
            >
                {buttonDisabled ? "No Signup" : "Signup"}
            </button>
            <Link
                href="/login"
                className="bg-gray-500 text-white px-1 py-1 mt-2 rounded-md hover:bg-gray-600 "
            >
                Already have an account,Visit Login
            </Link>
            <div >
                      <h1 className="flex text-center justify-center mt-2 text-xl">or</h1>
                      <div>
                        <button 
                        className="text-sm text-black hover:underline"
                        onClick={handleGoogleSignUP}>
                          Signup with google
                        </button>
                      </div>
            </div>
        </div>
    );
}