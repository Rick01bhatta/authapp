import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  
  return session ? redirect("/profile") : redirect("/login");
}

 
           


  

