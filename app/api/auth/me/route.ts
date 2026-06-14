import { NextResponse } from "next/server"
import { and, eq, ne, or } from "drizzle-orm"

import { users } from "@/db/schema"
import { getCurrentUser, normalizeEmail, normalizePhone } from "@/lib/auth"
import { getDb } from "@/lib/db"

type ProfileBody = {
  name?: string
  email?: string
  phone?: string
}

export async function GET() {
  const user = await getCurrentUser()

  return NextResponse.json({ user })
}

export async function PATCH(request: Request) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.json(
      { error: "You must be signed in." },
      { status: 401 }
    )
  }

  const body = (await request.json()) as ProfileBody
  const name = body.name?.trim() ?? ""
  const email = normalizeEmail(body.email ?? "")
  const phone = normalizePhone(body.phone ?? "")

  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: "Name, email, and phone number are required." },
      { status: 400 }
    )
  }

  if (!email.includes("@")) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 }
    )
  }

  const db = getDb()
  const existingUser = await db.query.users.findFirst({
    where: and(
      ne(users.id, currentUser.id),
      or(eq(users.email, email), eq(users.phone, phone))
    ),
  })

  if (existingUser) {
    return NextResponse.json(
      { error: "Another account already uses that email or phone number." },
      { status: 409 }
    )
  }

  const [user] = await db
    .update(users)
    .set({ name, email, phone, updatedAt: new Date() })
    .where(eq(users.id, currentUser.id))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
    })

  return NextResponse.json({ user })
}
