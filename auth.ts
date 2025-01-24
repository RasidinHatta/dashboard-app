import NextAuth, { CredentialsSignin } from "next-auth"
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

                if (res.status >= 400 && res.status < 600) {
                    console.error(`Error during authentication: ${res.statusText} (${res.status})`);
                    throw new Error("Authentication failed. Please check your credentials or try again later.");
                }                

                const user = await res.json();
                

                if (user) {
                    return user;
                }

                throw new CredentialsSignin("Invalid login");
            },
        }),
    ],
    callbacks: {
        async jwt({token, user}) {
            
            if (user) return { ...token, ...user }
            
            user = token.user
            // console.log("JWT", token.user)
            // console.log("User", user)
            return token;
        },

        async session({session, token}) {
            // console.log("Session", session)
            // console.log("Token", token)
            if (token.user) {
                session.user = {
                    id: token.user.id,
                    name: token.user.name,
                    email: token.user.email,
                    role: token.user.role,
                    createdAt: token.user.createdAt,
                    updatedAt: token.user.updatedAt,
                    emailVerified: token.user.emailVerified,
                };
            }
            session.backend_token = token.backend_token

            return session;
        }
    },
    pages: {
        signIn: "/auth/login",
        signOut: "/",
        error: "/auth/error",
    },
})