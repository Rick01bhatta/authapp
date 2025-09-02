import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // Not logged in → go back to login page
    redirect("/login");
  }

  return (
    <div className="flex flex-col py-2 justify-center items-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome to your Profile</h1>
      <p className="text-lg">
        This is a protected route. Only logged-in users can see this.
      </p>
      <p className="text-md mt-2">Logged in as: {session.user?.email}</p>
      <div className="mt-6">
        <SignOutButton />
      </div>
    </div>
  );
}
