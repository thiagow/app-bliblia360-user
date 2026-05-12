import "next-auth"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      plan: string
      firstAccess: boolean
      createdAt: Date | string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    plan: string
    firstAccess: boolean
    createdAt: Date
  }
}
