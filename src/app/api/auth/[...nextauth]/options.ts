import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google'
import * as admin from "firebase-admin";

// 🔹 Initialize Firebase Admin once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}
const auth = admin.auth();
// Helper to verify email/password with Firebase Auth REST API
async function verifyWithFirebase(email: string, password: string) {
	const apiKey = process.env.FIREBASE_API_KEY;
	const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
	const res = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password, returnSecureToken: true }),
	});
	const data = await res.json();
	if (!res.ok) {
		throw new Error(data.error?.message || "Login failed");
	}
	return data;
}
// 🔹 Helper: Verify Firebase ID Token (for direct Firebase login)
async function verifyIdToken(token: string) {
  try {
    return await auth.verifyIdToken(token);
  } catch (err) {
    console.error("Firebase token verification failed:", err);
    throw new Error("Invalid Firebase token");
  }
}

// 🔹 Check if user exists in Firebase Auth (Admin SDK)
async function checkUserInFirebase(email: string) {
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    return userRecord;
  } catch (error) {
    return null;
  }
}

export const authOptions: NextAuthOptions = {
	providers: [
		  GoogleProvider({
             clientId: process.env.GOOGLE_ID!,
             clientSecret: process.env.GOOGLE_SECRET!
    }),

		CredentialsProvider({
      id: "email-password",
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email", placeholder: "email@example.com" },
				password: { label: "Password", type: "password" },
			},
       
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Email and password required");
				}
				try {
					const user = await verifyWithFirebase(credentials.email, credentials.password);
					return { id: user.localId, email: user.email };
				} catch (error: any) {
					throw new Error(error.message || "Login failed");
				}
			},
		}),
	//   Credentials: Firebase ID Token
         CredentialsProvider({
                id: "firebase-token",
                name: "Firebase ID Token",
         credentials: {
                token: { label: "ID Token", type: "text" },
      },
         async authorize(credentials) {
                if (!credentials?.token) throw new Error("No token provided");
                const decoded = await verifyIdToken(credentials.token);
                return { id: decoded.uid, email: decoded.email };
       },
     }),
	],

	 callbacks: {
    // This runs after Google/Credentials sign in
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Check if Google user exists in Firebase
        const firebaseUser = await checkUserInFirebase(user.email!);
        if (!firebaseUser) {
          throw new Error("NOT_REGISTERED");
        }
      
      }
    
      return true;
    },
  },

	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/login",
	    error: "/login",
	},
	secret: process.env.NEXTAUTH_SECRET,
};
