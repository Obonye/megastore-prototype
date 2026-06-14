import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

import { users } from "@/db/schema"
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth"
import { getDb } from "@/lib/db"

type PasswordBody = {
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

export async function PATCH(request: Request) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.json(
      { error: "You must be signed in." },
      { status: 401 }
    )
  }

  const body = (await request.json()) as PasswordBody
  const currentPassword = body.currentPassword ?? ""
  const newPassword = body.newPassword ?? ""
  const confirmPassword = body.confirmPassword ?? ""

  if (!currentPassword || !newPassword || !confirmPassword) {
    return NextResponse.json(
      { error: "All password fields are required." },
      { status: 400 }
    )
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters." },
      { status: 400 }
    )
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json(
      { error: "New passwords do not match." },
      { status: 400 }
    )
  }

  const db = getDb()
  const user = await db.query.users.findFirst({
    where: eq(users.id, currentUser.id),
  })

  if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
    return NextResponse.json(
      { error: "Current password is incorrect." },
      { status: 401 }
    )
  }

  await db
    .update(users)
    .set({
      passwordHash: await hashPassword(newPassword),
      updatedAt: new Date(),
    })
    .where(eq(users.id, currentUser.id))

  return NextResponse.json({ ok: true })
}
