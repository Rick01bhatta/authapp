import {connectToDB} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest,NextResponse } from "next/server";
import bcryptjs from "bcryptjs";


connectToDB();


export async function POST(request:NextRequest){
    try {
        const reqBody= await request.json();
        const {username,email,password}=reqBody;
        if(!username || !email || !password){
            return NextResponse.json({message:"Please fill all the fields"}, {status:400})
        }
        const existingUser= await User.findOne({email:email});
        if(existingUser){
            return NextResponse.json({message:"User already exists"}, {status:400})
        }
        const salt= await bcryptjs.genSalt(10);
        const hashedPassword= await bcryptjs.hash(password,salt);
        const newUser=new User({
            username,
            email,
            password:hashedPassword
        })
        const savedUser=await newUser.save();
        console.log("User created successfully", savedUser);
        return NextResponse.json({
            message:"User created successfully",
            success:true,
            savedUser
        } )

        
    } catch (error) {
        console.log("Error in signup route")
        console.log(error)
        return NextResponse.json({message:"Internal Server Error"}, {status:500})
        
    }
}


