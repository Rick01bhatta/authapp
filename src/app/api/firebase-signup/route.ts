import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

// ✅ Initialize Firebase Admin once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST(req: Request) {
  try {
    const { email, name, picture } = await req.json();
    let existingUser;
    try {
      existingUser = await admin.auth().getUserByEmail(email);
    } catch {
      existingUser = null;
    }

    if (existingUser) {
      return NextResponse.json(
        { message: "EMAIL_ALREADY_REGISTERED" },
        { status: 400 }
      );
    }

    // 🔹 Create new Firebase user
    const newUser = await admin.auth().createUser({
      email,
      displayName: name,
      photoURL: picture,
    });

    return NextResponse.json({ uid: newUser.uid, email: newUser.email });
  } catch (error) {
    console.error("Firebase signup error:", error);
    return NextResponse.json({ message: "Signup failed" }, { status: 500 });
  }
}
