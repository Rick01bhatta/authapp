import { NextRequest, NextResponse } from "next/server";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {app } from "@/dbConfig/dbConfig";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }
    const auth = getAuth(app);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return NextResponse.json({ message: "User created successfully", user: userCredential.user });
  } catch (error: any) {
    console.error("Signup error:", error);
    let message = "Signup failed.";
    const code = error?.code || "unknown";
    if (code === "auth/email-already-in-use") {
      message = "Email already in use.";
    } else if (code === "auth/invalid-email") {
      message = "Invalid email address.";
    } else if (code === "auth/weak-password") {
      message = "Password should be at least 6 characters.";
    } else if (error?.message) {
      message = error.message;
    }
    return NextResponse.json({ message, code }, { status: 400 });
  }
}
