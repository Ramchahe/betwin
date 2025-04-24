import { type NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/auth"
import { sendWelcomeEmail } from "@/lib/mail"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters long" }, { status: 400 })
    }

    // Register user
    const { user, token } = await registerUser({ name, email, password })

    // Send welcome email
    await sendWelcomeEmail(email, name)

    return NextResponse.json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)

    if (error instanceof Error && error.message === "User already exists") {
      return NextResponse.json({ message: "Email already in use" }, { status: 409 })
    }

    return NextResponse.json({ message: "Registration failed" }, { status: 500 })
  }
}
