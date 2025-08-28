"use client"
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { Axios } from "axios";

export default function LoginPage(){

    const [user,setUser]=React.useState({
        email:"",
        password:"",
       
    })
    const onLogin= async()=>{

    }
    return(
        <div className="flex flex-col py-2 justify-center items-center min-h-screen border p-4 rounded-lg shadow-lg max-w-md mx-auto bg-gray-500">

           
            <label htmlFor="email">Email</label>
            <input className="border-2 border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            type="email"
            id="email"
            value={user.email}
            onChange={(e)=>setUser({...user,email:e.target.value})}
            placeholder="Enter Email"
            />
            <label htmlFor="password">Password</label>
            <input className="border-2 border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            type="password"
            id="password"
            value={user.password}
            onChange={(e)=>setUser({...user,password:e.target.value})}
            placeholder="Enter Password"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={onLogin}
            >Signup here</button>
            <Link href="/signup" className="bg-gray-500 text-white px-1 py-1 mt-2 rounded-md hover:bg-gray-600">Visit Signup</Link>
          
        </div>
    )
}