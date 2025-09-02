import SignupPageComponent from  "@/components/SignupPageComponent" 
import { getServerSession } from "next-auth";
import { authOptions} from "@/app/api/auth/[...nextauth]/options";
import {redirect}  from "next/navigation"

export default async function SignupPage(){
    const session = await getServerSession(authOptions);
    if (session) {
        redirect("/profile")
    }
    return <SignupPageComponent/>
}



