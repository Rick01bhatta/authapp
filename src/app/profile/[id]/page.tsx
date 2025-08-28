export default function userProfile({params}:any){
    return(
        <div className="flex flex-col py-2 justify-center items-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Welcome to your Profile
                <span className="p-2 ml-2 rounded bg-orange-500 text-black">{params.id}</span>
            </h1>
            <p className="text-lg">This is a protected route. Only logged-in users can see this.</p>
        </div>
    )
}