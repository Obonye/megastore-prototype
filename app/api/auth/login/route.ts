import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"

import { users } from "@/db/schema"
import {
  authSessionCookieName,
  createUserSession,
  normalizeEmail,
  normalizePhone,
  verifyPassword,
} from "@/lib/auth"
import { getDb } from "@/lib/db"

type LoginBody = {
  identifier?: string
  password?: string
}

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBody
  const identifier = body.identifier?.trim() ?? ""
  const password = body.password ?? ""

  if (!identifier || !password) {
    return NextResponse.json(
      { error: "Email or phone number and password are required." },
      { status: 400 }
    )
  }

  const db = getDb()
  const user = await db.query.users.findFirst({
    where: identifier.includes("@")
      ? eq(users.email, normalizeEmail(identifier))
      : eq(users.phone, normalizePhone(identifier)),
  })

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json(
      { error: "Invalid email, phone number, or password." },
      { status: 401 }
    )
  }

  const { expiresAt, sessionToken } = await createUserSession(user.id)

  const response = NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  })

  response.cookies.set(authSessionCookieName, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  })

  return response
}
