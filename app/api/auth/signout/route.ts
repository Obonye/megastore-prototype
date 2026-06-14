import { cookies } from "next/headers"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

import { authSessions } from "@/db/schema"
import { authSessionCookieName, hashSessionToken } from "@/lib/auth"
import { getDb } from "@/lib/db"

export async function POST() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(authSessionCookieName)?.value

  if (sessionToken) {
    await getDb()
      .delete(authSessions)
      .where(eq(authSessions.tokenHash, await hashSessionToken(sessionToken)))
  }

  const response = NextResponse.json({ ok: true })

  response.cookies.set(authSessionCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  })

  return response
}
