import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

const adminGithubId = process.env.AUTH_GITHUB_ADMIN_ID;

if (!adminGithubId) {
  throw new Error("AUTH_GITHUB_ADMIN_ID is required");
}

const adminGithubIdNumber = Number(adminGithubId);

if (!Number.isInteger(adminGithubIdNumber)) {
  throw new Error("AUTH_GITHUB_ADMIN_ID must be a valid GitHub user ID");
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID ?? "",
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "github") {
        return false;
      }

      const githubProfile = profile as { id?: number | string } | undefined;

      return Number(githubProfile?.id) === adminGithubIdNumber;
    },
  },
};

export default NextAuth(authOptions);