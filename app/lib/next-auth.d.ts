import NextAuth from "next-auth";

declare module "next-auth" {

    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
            createdAt: string;
            updatedAt: string;
            emailVerified: Date | null;
        }

        backend_token: {
            accessToken: string;
        }
    }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
    interface JWT {
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
            createdAt: string;
            updatedAt: string;
            emailVerified: Date | null;
        }

        backend_token: {
            accessToken: string;
        }
    }
}