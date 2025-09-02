import LoginPageComponent from "@/components/LoginPageComponent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
export default  async function LoginPage(){
   const session = await getServerSession(authOptions);
   if (session) {
    redirect("/profile");
    
   }
  return <LoginPageComponent/>;
   
   
}