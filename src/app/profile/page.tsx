export default function ProfilePage(){
    return(
        <div className="flex flex-col py-2 justify-center items-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Welcome to your Profile</h1>
            <p className="text-lg">This is a protected route. Only logged-in users can see this.</p>
        </div>
    )
}