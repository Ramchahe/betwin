import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        walletBalance: user.wallet_balance,
        bonusBalance: user.bonus_balance,
      },
    })
  } catch (error) {
    console.error("Auth check error:", error)

    return NextResponse.json({ message: "Authentication check failed" }, { status: 500 })
  }
}
