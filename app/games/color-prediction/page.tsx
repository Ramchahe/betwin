"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, X, History, TrendingUp, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import BetAmountSelector from "@/components/bet-amount-selector"

type Color = "red" | "green" | null

interface GameHistory {
  id: number
  color: Color
  prediction: Color
  amount: number
  result: "win" | "lose"
  timestamp: Date
}

export default function ColorPredictionPage() {
  const [selectedColor, setSelectedColor] = useState<Color>(null)
  const [betAmount, setBetAmount] = useState(10)
  const [isPlaying, setIsPlaying] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [result, setResult] = useState<Color>(null)
  const [history, setHistory] = useState<GameHistory[]>([])
  const [lastResults, setLastResults] = useState<Color[]>([])
  const router = useRouter()
  const { toast } = useToast()

  // Add a new state for automatic game running
  const [autoGame, setAutoGame] = useState(true)

  // Add useEffect for automatic game running
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (autoGame && !isPlaying && !result) {
      timer = setTimeout(() => {
        // Generate a new result automatically
        runGameCycle()
      }, 2000)
    }

    return () => clearTimeout(timer)
  }, [autoGame, isPlaying, result])

  // Create a function for the game cycle
  const runGameCycle = () => {
    setIsPlaying(true)
    setCountdown(5)

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          revealAutomaticResult()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Create a function for automatic result reveal
  const revealAutomaticResult = () => {
    // Generate random result
    const randomValue = Math.random()
    const resultColor: Color = randomValue < 0.48 ? "red" : "green"

    setResult(resultColor)

    // Update last results
    setLastResults((prev) => [resultColor, ...prev.slice(0, 9)])

    // Check if player placed a bet and won
    if (selectedColor) {
      const isWin = selectedColor === resultColor

      // Add to history
      const gameResult: GameHistory = {
        id: Date.now(),
        color: resultColor,
        prediction: selectedColor,
        amount: betAmount,
        result: isWin ? "win" : "lose",
        timestamp: new Date(),
      }

      setHistory((prev) => [gameResult, ...prev.slice(0, 9)])

      // Show toast
      if (isWin) {
        toast({
          title: "You won!",
          description: `Congratulations! You've won ₹${betAmount * 2}`,
        })
      } else {
        toast({
          title: "You lost",
          description: "Better luck next time!",
          variant: "destructive",
        })
      }

      // Reset selection
      setSelectedColor(null)
    }

    // Reset game after 3 seconds
    setTimeout(() => {
      setIsPlaying(false)
      setResult(null)
    }, 3000)
  }

  // Place bet
  const placeBet = () => {
    if (!selectedColor) {
      toast({
        title: "Select a color",
        description: "Please select red or green to place your bet.",
        variant: "destructive",
      })
      return
    }

    // If game is already running, just register the bet
    if (isPlaying) {
      toast({
        title: "Bet placed",
        description: `Your bet of ₹${betAmount} on ${selectedColor.toUpperCase()} has been placed.`,
      })
      return
    }

    // Otherwise start a new game
    runGameCycle()
  }

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
        <h1 className="text-3xl font-bold mb-6">Color Prediction</h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Predict the Next Color</CardTitle>
                <CardDescription>Choose red or green and win 2x your bet if you're right!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  {/* Result display */}
                  <div className="w-full max-w-md aspect-square flex items-center justify-center mb-8 relative">
                    <div
                      className={`w-full h-full rounded-xl transition-all duration-500 ${
                        result === "red" ? "bg-red-500" : result === "green" ? "bg-green-500" : "bg-gray-200"
                      }`}
                    >
                      {result && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full">
                            {result === selectedColor ? (
                              <Check className="h-16 w-16 text-white" />
                            ) : (
                              <X className="h-16 w-16 text-white" />
                            )}
                          </div>
                        </div>
                      )}

                      {isPlaying && !result && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-6xl font-bold text-white mb-2">{countdown}</div>
                            <div className="text-white text-xl">Revealing soon...</div>
                          </div>
                        </div>
                      )}

                      {!isPlaying && !result && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p className="text-xl">Select a color and place your bet</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Last results */}
                  <div className="mb-8 w-full max-w-md">
                    <p className="text-sm font-medium mb-2 flex items-center">
                      <History className="h-4 w-4 mr-1" />
                      Last Results
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {lastResults.length > 0 ? (
                        lastResults.map((color, index) => (
                          <div
                            key={index}
                            className={`w-8 h-8 rounded-full flex-shrink-0 ${
                              color === "red" ? "bg-red-500" : "bg-green-500"
                            }`}
                          ></div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No results yet</p>
                      )}
                    </div>
                  </div>

                  {/* Color selection */}
                  <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-6">
                    <button
                      className={`h-20 rounded-xl bg-red-500 text-white font-bold text-xl transition-all ${
                        selectedColor === "red"
                          ? "ring-4 ring-red-300 scale-105"
                          : "opacity-90 hover:opacity-100 hover:scale-105"
                      } ${isPlaying ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => !isPlaying && setSelectedColor("red")}
                      disabled={isPlaying}
                    >
                      RED
                    </button>
                    <button
                      className={`h-20 rounded-xl bg-green-500 text-white font-bold text-xl transition-all ${
                        selectedColor === "green"
                          ? "ring-4 ring-green-300 scale-105"
                          : "opacity-90 hover:opacity-100 hover:scale-105"
                      } ${isPlaying ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => !isPlaying && setSelectedColor("green")}
                      disabled={isPlaying}
                    >
                      GREEN
                    </button>
                  </div>

                  {/* Bet amount */}
                  <div className="w-full max-w-md mb-6">
                    <p className="text-sm font-medium mb-2">Bet Amount (₹)</p>
                    <BetAmountSelector
                      value={betAmount}
                      onChange={setBetAmount}
                      options={[2, 5, 10, 20, 50, 100]}
                      disabled={isPlaying}
                    />
                  </div>

                  {/* Place bet button */}
                  <Button size="lg" className="w-full max-w-md" onClick={placeBet} disabled={!selectedColor}>
                    {isPlaying
                      ? `Revealing in ${countdown}s`
                      : `Place Bet on ${selectedColor ? selectedColor.toUpperCase() : "a color"}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Your Predictions
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
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <div
                              className={`w-6 h-6 rounded-full ${
                                item.prediction === "red" ? "bg-red-500" : "bg-green-500"
                              }`}
                            ></div>
                            <ArrowRight className="h-4 w-4 mx-1" />
                            <div
                              className={`w-6 h-6 rounded-full ${item.color === "red" ? "bg-red-500" : "bg-green-500"}`}
                            ></div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">{formatTime(item.timestamp)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${item.result === "win" ? "text-green-600" : "text-red-600"}`}>
                            {item.result === "win"
                              ? `+₹${(item.amount * 2).toFixed(2)}`
                              : `-₹${item.amount.toFixed(2)}`}
                          </p>
                          <p className="text-xs text-muted-foreground">Bet: ₹{item.amount}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">No prediction history yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Game Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p>Predict whether the next color will be red or green.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Select a color (red or green)</li>
                  <li>Place your bet</li>
                  <li>If your prediction is correct, you win 2x your bet</li>
                  <li>If your prediction is wrong, you lose your bet</li>
                </ul>
                <p className="text-muted-foreground">
                  The game is completely random with each color having an equal chance of appearing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Games run automatically. Select a color and place your bet before the countdown ends!
        </p>
      </div>
    </div>
  )
}
