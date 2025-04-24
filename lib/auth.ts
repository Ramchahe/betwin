import { compare, hash } from "bcryptjs"
import { sign, verify } from "jsonwebtoken"
import { cookies } from "next/headers"
import { getUserByEmail, createUser } from "./db"

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

export async function createJWT(userId: number, email: string): Promise<string> {
  return sign({ userId, email }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  })
}

export async function verifyJWT(token: string): Promise<any> {
  try {
    return verify(token, process.env.JWT_SECRET || "fallback_secret")
  } catch (error) {
    return null
  }
}

export async function setAuthCookie(token: string) {
  cookies().set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}

export async function removeAuthCookie() {
  cookies().delete("auth_token")
}

export async function getCurrentUser() {
  const token = cookies().get("auth_token")?.value

  if (!token) {
    return null
  }

  const decoded = await verifyJWT(token)

  if (!decoded) {
    return null
  }

  const user = await getUserByEmail(decoded.email)

  if (!user) {
    return null
  }

  // Don't return sensitive information
  delete user.password_hash

  return user
}

export async function registerUser({ name, email, password }: { name: string; email: string; password: string }) {
  // Check if user already exists
  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    throw new Error("User already exists")
  }

  // Hash password
  const passwordHash = await hashPassword(password)

  // Create user
  await createUser({ name, email, passwordHash })

  // Get the created user
  const user = await getUserByEmail(email)

  // Create JWT
  const token = await createJWT(user.id, user.email)

  // Set auth cookie
  await setAuthCookie(token)

  return { user, token }
}

export async function loginUser({ email, password }: { email: string; password: string }) {
  // Get user
  const user = await getUserByEmail(email)

  if (!user) {
    throw new Error("Invalid credentials")
  }

  // Verify password
  const isValid = await verifyPassword(password, user.password_hash)

  if (!isValid) {
    throw new Error("Invalid credentials")
  }

  // Create JWT
  const token = await createJWT(user.id, user.email)

  // Set auth cookie
  await setAuthCookie(token)

  // Don't return sensitive information
  delete user.password_hash

  return { user, token }
}

export async function logoutUser() {
  await removeAuthCookie()
}
