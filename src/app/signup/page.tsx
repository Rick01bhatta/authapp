
"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

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
        </div>
    );
}