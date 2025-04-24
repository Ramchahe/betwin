"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, User, Wallet, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isLandingPage = pathname === "/"
  const headerClass = `fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
    isScrolled || !isLandingPage ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
  }`

  const linkClass = `font-medium transition-colors ${
    isScrolled || !isLandingPage ? "text-gray-700 hover:text-purple-600" : "text-white hover:text-white/80"
  }`

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <span className={`text-xl font-bold ${isScrolled || !isLandingPage ? "text-purple-600" : "text-white"}`}>
              BetWin
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/games" className={linkClass}>
              Games
            </Link>
            <Link href="/leaderboard" className={linkClass}>
              Leaderboard
            </Link>
            <Link href="/terms" className={linkClass}>
              Terms
            </Link>
            <Link href="/contact" className={linkClass}>
              Contact
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Link href="/wallet">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Wallet className="h-4 w-4" />
                    Wallet
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/images/avatar-1.png" alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wallet">Wallet</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/history">Game History</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()}>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <X className={isScrolled || !isLandingPage ? "text-gray-700" : "text-white"} />
            ) : (
              <Menu className={isScrolled || !isLandingPage ? "text-gray-700" : "text-white"} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/games"
                className="py-2 text-gray-700 hover:text-purple-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Games
              </Link>
              <Link
                href="/leaderboard"
                className="py-2 text-gray-700 hover:text-purple-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Leaderboard
              </Link>
              <Link
                href="/terms"
                className="py-2 text-gray-700 hover:text-purple-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Terms
              </Link>
              <Link
                href="/contact"
                className="py-2 text-gray-700 hover:text-purple-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              <div className="pt-2 border-t flex flex-col space-y-3">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 py-2 text-gray-700 hover:text-purple-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      href="/wallet"
                      className="flex items-center gap-2 py-2 text-gray-700 hover:text-purple-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Wallet className="h-4 w-4" />
                      Wallet
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center gap-2 py-2 text-gray-700 hover:text-purple-600"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="py-2 text-gray-700 hover:text-purple-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="py-2 text-gray-700 hover:text-purple-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
