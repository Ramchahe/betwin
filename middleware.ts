import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define which paths require authentication
const protectedPaths = [
  "/games",
  "/games/tictactoe",
  "/games/aviator",
  "/games/color-prediction",
  "/wallet",
  "/profile",
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  if (isProtectedPath) {
    // Check for authentication token
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      // Redirect to login if no token is found
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", encodeURI(pathname))
      return NextResponse.redirect(url)
    }

    // In a real app, you would verify the token here
    // For demo purposes, we'll just check if it exists
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/games/:path*", "/wallet/:path*", "/profile/:path*"],
}
