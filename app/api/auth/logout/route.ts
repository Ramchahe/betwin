import { NextResponse } from "next/server"
import { logoutUser } from "@/lib/auth"

export async function POST() {
  try {
    await logoutUser()

    return NextResponse.json({
      message: "Logout successful",
    })
  } catch (error) {
    console.error("Logout error:", error)

    return NextResponse.json({ message: "Logout failed" }, { status: 500 })
  }
}
