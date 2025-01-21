import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email", placeholder: "name@example.com" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials.email || !credentials.password) return null
                const { email, password } = credentials
                const Backend_Url = process.env.NEXT_PUBLIC_API_BASE_URL
                const res = await fetch(`${Backend_Url}/api/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                })

                if (res.status == 401) {
                    console.log(res.statusText)

                    return null
                }

                const user = await res.json()
                return user
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
    },
})