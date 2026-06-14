import { NextResponse } from "next/server"
import { or, eq } from "drizzle-orm"

import { users } from "@/db/schema"
import {
  authSessionCookieName,
  createUserSession,
  hashPassword,
  normalizeEmail,
  normalizePhone,
} from "@/lib/auth"
import { getDb } from "@/lib/db"

type RegisterBody = {
  name?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
}

export async function POST(request: Request) {
  const body = (await request.json()) as RegisterBody
  const name = body.name?.trim() ?? ""
  const email = normalizeEmail(body.email ?? "")
  const phone = normalizePhone(body.phone ?? "")
  const password = body.password ?? ""
  const confirmPassword = body.confirmPassword ?? ""

  if (!name || !email || !phone || !password || !confirmPassword) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    )
  }

  if (!email.includes("@")) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 }
    )
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    )
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Passwords do not match." },
      { status: 400 }
    )
  }

  const db = getDb()
  const existingUser = await db.query.users.findFirst({
    where: or(eq(users.email, email), eq(users.phone, phone)),
  })

  if (existingUser) {
    return NextResponse.json(
      { error: "An account already exists with that email or phone number." },
      { status: 409 }
    )
  }

  const passwordHash = await hashPassword(password)
  const [user] = await db
    .insert(users)
    .values({ name, email, phone, passwordHash })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
    })

  const { expiresAt, sessionToken } = await createUserSession(user.id)
  const response = NextResponse.json({ user }, { status: 201 })

  response.cookies.set(authSessionCookieName, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  })

  return response
}
