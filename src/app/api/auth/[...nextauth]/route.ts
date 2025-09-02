import NextAuth from "next-auth";
import { authOptions } from "./options";

// NextAuth handler for both GET and POST requests in the App Router
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };