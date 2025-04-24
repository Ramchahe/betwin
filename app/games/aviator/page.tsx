"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Plane, TrendingUp, Timer, AlertTriangle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import BetAmountSelector from "@/components/bet-amount-selector"

interface BetHistory {
  id: number
  multiplier: number
  amount: number
  winAmount: number
  timestamp: Date
}

export default function AviatorPage() {
  const [isFlying, setIsFlying] = useState(false)
  const [multiplier, setMultiplier] = useState(1.0)
  const [betAmount, setBetAmount] = useState(10)
  const [autoCashout, setAutoCashout] = useState<number | null>(null)
  const [autoCashoutInput, setAutoCashoutInput] = useState("")
  const [hasCashedOut, setHasCashedOut] = useState(false)
  const [crashPoint, setCrashPoint] = useState(0)
  const [history, setHistory] = useState<BetHistory[]>([])
  const [nextGameCountdown, setNextGameCountdown] = useState(0)
  const [isWaiting, setIsWaiting] = useState(false)
  const animationRef = useRef<number>(0)
  const router = useRouter()
  const { toast } = useToast()
  // First, add a new state for game status
  const [gameStatus, setGameStatus] = useState<"waiting" | "flying" | "crashed">("waiting")

  // Modify the useEffect to start games automatically
  useEffect(() => {
    // Start the first game automatically
    if (gameStatus === "waiting" && !isWaiting) {
      startGame()
    }

    // Auto restart games
    if (gameStatus === "crashed") {
      const timer = setTimeout(() => {
        setIsWaiting(true)
        setNextGameCountdown(3)

        const countdownInterval = setInterval(() => {
          setNextGameCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval)
              setIsWaiting(false)
              initializeGame()
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [gameStatus])

  // Update the initializeGame function
  const initializeGame = () => {
    // Reset game state
    setIsFlying(true)
    setGameStatus("flying")
    setMultiplier(1.0)
    setHasCashedOut(false)

    // Generate random crash point (between 1.1 and 10)
    // With a small chance of early crash (below 1.5)
    const earlyChance = Math.random() < 0.2
    const randomCrash = earlyChance ? 1 + Math.random() * 0.5 : 1.1 + Math.random() * 8.9

    setCrashPoint(Number.parseFloat(randomCrash.toFixed(2)))

    // Start animation
    const startTime = performance.now()
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime

      // Exponential growth formula for multiplier
      // Faster at the beginning, slower as it goes up
      const newMultiplier = 1 + Math.pow(elapsed / 2000, 1.5)
      const roundedMultiplier = Math.floor(newMultiplier * 100) / 100

      setMultiplier(roundedMultiplier)

      // Check for auto cashout
      if (autoCashout && roundedMultiplier >= autoCashout && !hasCashedOut) {
        cashout(true)
      }

      // Check if crashed
      if (roundedMultiplier >= crashPoint) {
        setIsFlying(false)
        setGameStatus("crashed")

        if (!hasCashedOut) {
          toast({
            title: "Crashed!",
            description: `The plane crashed at ${crashPoint.toFixed(2)}x`,
            variant: "destructive",
          })
        }

        return
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  // Update the startGame function to be simpler
  const startGame = () => {
    if (isFlying || isWaiting) return

    setIsWaiting(true)
    setNextGameCountdown(3)

    const countdownInterval = setInterval(() => {
      setNextGameCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          setIsWaiting(false)
          initializeGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Cash out
  const cashout = (isAuto = false) => {
    if (!isFlying || hasCashedOut) return

    setHasCashedOut(true)

    const winAmount = betAmount * multiplier

    // Add to history
    setHistory((prev) => [
      {
        id: Date.now(),
        multiplier,
        amount: betAmount,
        winAmount,
        timestamp: new Date(),
      },
      ...prev.slice(0, 9), // Keep only last 10 entries
    ])

    toast({
      title: isAuto ? "Auto Cashout!" : "Cashed Out!",
      description: `You won ₹${winAmount.toFixed(2)} (${multiplier.toFixed(2)}x)`,
    })
  }

  // Set auto cashout
  const handleSetAutoCashout = () => {
    const value = Number.parseFloat(autoCashoutInput)
    if (isNaN(value) || value < 1.1) {
      toast({
        title: "Invalid value",
        description: "Auto cashout must be at least 1.1x",
        variant: "destructive",
      })
      return
    }

    setAutoCashout(value)
    toast({
      title: "Auto cashout set",
      description: `You will automatically cash out at ${value.toFixed(2)}x`,
    })
  }

  // Clear auto cashout
  const clearAutoCashout = () => {
    setAutoCashout(null)
    setAutoCashoutInput("")
  }

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Format time
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date)
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Aviator</h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative bg-gradient-to-b from-blue-400 to-blue-600 h-80 flex items-center justify-center">
                {/* Sky background */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-600 to-transparent"></div>

                  {/* Clouds */}
                  <div className="absolute top-10 left-10 w-20 h-8 bg-white rounded-full opacity-80"></div>
                  <div className="absolute top-20 left-40 w-32 h-10 bg-white rounded-full opacity-80"></div>
                  <div className="absolute top-15 right-20 w-24 h-8 bg-white rounded-full opacity-80"></div>
                </div>

                {/* Multiplier */}
                <div className="absolute top-4 left-0 right-0 text-center">
                  <div
                    className={`text-5xl font-bold text-white transition-all ${
                      isFlying && !hasCashedOut ? "scale-110" : ""
                    }`}
                  >
                    {multiplier.toFixed(2)}x
                  </div>
                </div>

                {/* Plane */}
                <div
                  className={`relative transition-all duration-300 ${
                    isFlying
                      ? "translate-y-0 opacity-100 scale-100"
                      : hasCashedOut
                        ? "translate-y-0 opacity-100 scale-100"
                        : "translate-y-32 opacity-0 scale-50"
                  }`}
                >
                  <Plane
                    className={`h-16 w-16 text-white transform rotate-45 transition-all ${
                      hasCashedOut ? "text-green-400" : isFlying ? "text-white" : "text-red-500"
                    }`}
                  />

                  {/* Trail */}
                  {isFlying && <div className="absolute top-1/2 right-full w-32 h-1 bg-white/50 rounded-full"></div>}
                </div>

                {/* Crash message */}
                {!isFlying && !isWaiting && (
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    {hasCashedOut ? (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full">
                        <Check className="h-4 w-4" />
                        Cashed out at {multiplier.toFixed(2)}x
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full">
                        <AlertTriangle className="h-4 w-4" />
                        Crashed at {crashPoint.toFixed(2)}x
                      </div>
                    )}
                  </div>
                )}

                {/* Next game countdown */}
                {isWaiting && (
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-full">
                      <Timer className="h-4 w-4" />
                      Next game in {nextGameCountdown}s
                    </div>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2">Bet Amount (₹)</p>
                    <BetAmountSelector
                      value={betAmount}
                      onChange={setBetAmount}
                      options={[2, 5, 10, 20, 50, 100]}
                      disabled={isFlying || isWaiting}
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2">Auto Cashout (x)</p>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="1.1"
                        step="0.1"
                        placeholder="e.g. 2.00"
                        value={autoCashoutInput}
                        onChange={(e) => setAutoCashoutInput(e.target.value)}
                        disabled={isFlying || isWaiting}
                      />
                      {autoCashout ? (
                        <Button variant="outline" onClick={clearAutoCashout} disabled={isFlying || isWaiting}>
                          Clear
                        </Button>
                      ) : (
                        <Button onClick={handleSetAutoCashout} disabled={isFlying || isWaiting || !autoCashoutInput}>
                          Set
                        </Button>
                      )}
                    </div>
                    {autoCashout && (
                      <p className="text-xs text-muted-foreground mt-1">Auto cashout at {autoCashout.toFixed(2)}x</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Button
                    size="lg"
                    onClick={() => {
                      // Only place bet if not already betting
                      if (!isFlying && !isWaiting) {
                        startGame()
                      }
                    }}
                    disabled={isFlying || isWaiting}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isWaiting ? `Starting in ${nextGameCountdown}s` : isFlying ? "Game in Progress" : "Place Bet"}
                  </Button>

                  <Button
                    size="lg"
                    onClick={() => cashout()}
                    disabled={!isFlying || hasCashedOut}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Cash Out ({(betAmount * multiplier).toFixed(2)})
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Games
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {history.length > 0 ? (
                    history.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{item.multiplier.toFixed(2)}x</p>
                          <p className="text-xs text-muted-foreground">{formatTime(item.timestamp)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-600 font-medium">+₹{item.winAmount.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">Bet: ₹{item.amount}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">No game history yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Game Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p>Watch the multiplier increase and cash out before the plane flies away!</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Place your bet and watch the multiplier grow</li>
                  <li>Cash out anytime to secure your winnings</li>
                  <li>If you don't cash out before the crash, you lose your bet</li>
                  <li>Set an auto cashout to automatically secure your winnings</li>
                </ul>
                <p className="text-muted-foreground">
                  The longer you wait, the higher the potential reward, but also the higher the risk!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
