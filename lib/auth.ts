import { randomBytes, scrypt, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"
import { cookies } from "next/headers"
import { eq } from "drizzle-orm"

import { authSessions, users } from "@/db/schema"
import { getDb } from "@/lib/db"

const scryptAsync = promisify(scrypt)
const keyLength = 64
export const authSessionCookieName = "auth_session"

export type AuthUser = {
  id: string
  name: string
  email: string
  phone: string
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function normalizePhone(phone: string) {
  return phone.replace(/[\s()-]/g, "").trim()
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const derivedKey = (await scryptAsync(password, salt, keyLength)) as Buffer

  return `${salt}:${derivedKey.toString("hex")}`
}

export async function verifyPassword(password: string, passwordHash: string) {
  const [salt, storedKey] = passwordHash.split(":")

  if (!salt || !storedKey) {
    return false
  }

  const storedKeyBuffer = Buffer.from(storedKey, "hex")
  const derivedKey = (await scryptAsync(password, salt, keyLength)) as Buffer

  return (
    storedKeyBuffer.length === derivedKey.length &&
    timingSafeEqual(storedKeyBuffer, derivedKey)
  )
}

export function createSessionToken() {
  return randomBytes(32).toString("hex")
}

export async function hashSessionToken(token: string) {
  const derivedKey = (await scryptAsync(token, "auth-session", 32)) as Buffer

  return derivedKey.toString("hex")
}

export function getSessionExpiry() {
  return new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
}

export async function createUserSession(userId: string) {
  const db = getDb()
  const sessionToken = createSessionToken()
  const expiresAt = getSessionExpiry()

  await db.insert(authSessions).values({
    userId,
    tokenHash: await hashSessionToken(sessionToken),
    expiresAt,
  })

  return { expiresAt, sessionToken }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(authSessionCookieName)?.value

  if (!sessionToken) {
    return null
  }

  const db = getDb()
  const session = await db
    .select({
      expiresAt: authSessions.expiresAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
      },
    })
    .from(authSessions)
    .innerJoin(users, eq(authSessions.userId, users.id))
    .where(eq(authSessions.tokenHash, await hashSessionToken(sessionToken)))
    .limit(1)

  const currentSession = session[0]

  if (!currentSession || currentSession.expiresAt <= new Date()) {
    return null
  }

  return currentSession.user
}
