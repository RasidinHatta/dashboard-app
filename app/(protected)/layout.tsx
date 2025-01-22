import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        // Redirect to login page if user is not authenticated
        redirect('/api/auth/signin');
    }

    return (
        <div>
            {children}
        </div>
    );
}