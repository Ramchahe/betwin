"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { Socket } from "socket.io-client"
import { X, Circle, Trophy, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import BetAmountSelector from "@/components/bet-amount-selector"

type Player = "X" | "O"
type GameStatus = "waiting" | "playing" | "finished"
type GameResult = "win" | "lose" | "draw" | null

interface GameState {
  board: (Player | null)[]
  currentPlayer: Player
  status: GameStatus
  result: GameResult
  opponent: string | null
  isBot: boolean
}

export default function TicTacToePage() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: "X",
    status: "waiting",
    result: null,
    opponent: null,
    isBot: false,
  })
  const [player, setPlayer] = useState<Player>("X")
  const [betAmount, setBetAmount] = useState<number>(10)
  const [waitingTime, setWaitingTime] = useState<number>(0)
  const [isConnecting, setIsConnecting] = useState<boolean>(false)
  const router = useRouter()
  const { toast } = useToast()

  // Initialize socket connection
  useEffect(() => {
    // In a real app, this would connect to your actual backend
    // For demo purposes, we'll simulate the socket behavior
    const simulatedSocket = {
      on: (event: string, callback: Function) => {
        // Store callbacks for simulation
        if (event === "gameStart") {
          ;(simulatedSocket as any).gameStartCallback = callback
        } else if (event === "gameUpdate") {
          ;(simulatedSocket as any).gameUpdateCallback = callback
        } else if (event === "gameEnd") {
          ;(simulatedSocket as any).gameEndCallback = callback
        }
      },
      emit: (event: string, data: any) => {
        console.log(`Emitted ${event}:`, data)

        // Simulate responses
        if (event === "joinGame") {
          setTimeout(() => {
            if ((simulatedSocket as any).gameStartCallback) {
              ;(simulatedSocket as any).gameStartCallback({
                opponent: "Player2",
                isBot: false,
              })
            }
          }, 1000)
        } else if (event === "makeMove") {
          // Simulate opponent move after player's move
          setTimeout(() => {
            if ((simulatedSocket as any).gameUpdateCallback) {
              const newBoard = [...data.board]
              const emptyCells = newBoard.map((cell, idx) => (cell === null ? idx : null)).filter((idx) => idx !== null)

              if (emptyCells.length > 0) {
                const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)] as number
                newBoard[randomCell] = player === "X" ? "O" : "X"
                ;(simulatedSocket as any).gameUpdateCallback({
                  board: newBoard,
                  currentPlayer: player,
                })

                // Check for game end
                const winner = calculateWinner(newBoard)
                if (winner || !newBoard.includes(null)) {
                  setTimeout(() => {
                    if ((simulatedSocket as any).gameEndCallback) {
                      ;(simulatedSocket as any).gameEndCallback({
                        result: winner ? (winner === player ? "win" : "lose") : "draw",
                      })
                    }
                  }, 500)
                }
              }
            }
          }, 1000)
        }
      },
      disconnect: () => {
        console.log("Socket disconnected")
      },
    } as unknown as Socket

    setSocket(simulatedSocket)

    return () => {
      if (simulatedSocket) {
        simulatedSocket.disconnect()
      }
    }
  }, [player])

  // Bot timer
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (gameState.status === "waiting" && !gameState.opponent) {
      timer = setInterval(() => {
        setWaitingTime((prev) => {
          const newTime = prev + 1

          // Start bot game after 10 seconds
          if (newTime >= 10 && !gameState.opponent) {
            clearInterval(timer)
            startBotGame()
            return 0
          }

          return newTime
        })
      }, 1000)
    }

    return () => {
      clearInterval(timer)
    }
  }, [gameState.status, gameState.opponent])

  // Start a game with a bot
  const startBotGame = useCallback(() => {
    if (socket) {
      setGameState((prev) => ({
        ...prev,
        status: "playing",
        opponent: generateRandomName(),
        isBot: true,
      }))

      toast({
        title: "Opponent found!",
        description: "Game is starting now.",
      })
    }
  }, [socket, toast])

  // Join game
  const joinGame = useCallback(() => {
    if (socket) {
      setIsConnecting(true)

      // Reset game state
      setGameState({
        board: Array(9).fill(null),
        currentPlayer: "X",
        status: "waiting",
        result: null,
        opponent: null,
        isBot: false,
      })

      // Emit join game event
      socket.emit("joinGame", { betAmount })

      // Listen for game start
      socket.on("gameStart", (data: { opponent: string; isBot: boolean }) => {
        setGameState((prev) => ({
          ...prev,
          status: "playing",
          opponent: data.opponent,
          isBot: data.isBot,
        }))

        setIsConnecting(false)

        toast({
          title: "Game started!",
          description: `You're playing against ${data.opponent}`,
        })
      })

      // Listen for game updates
      socket.on("gameUpdate", (data: { board: (Player | null)[]; currentPlayer: Player }) => {
        setGameState((prev) => ({
          ...prev,
          board: data.board,
          currentPlayer: data.currentPlayer,
        }))
      })

      // Listen for game end
      socket.on("gameEnd", (data: { result: GameResult }) => {
        setGameState((prev) => ({
          ...prev,
          status: "finished",
          result: data.result,
        }))

        // Show toast based on result
        if (data.result === "win") {
          toast({
            title: "You won!",
            description: `You've won ₹${betAmount * 2}`,
          })
        } else if (data.result === "lose") {
          toast({
            title: "You lost",
            description: "Better luck next time!",
          })
        } else {
          toast({
            title: "It's a draw!",
            description: "Your bet has been returned.",
          })
        }
      })
    }
  }, [socket, betAmount, toast])

  // Handle cell click
  const handleCellClick = (index: number) => {
    // Check if the cell is already filled or it's not the player's turn
    if (gameState.board[index] || gameState.status !== "playing" || gameState.currentPlayer !== player) {
      return
    }

    // Create a new board with the player's move
    const newBoard = [...gameState.board]
    newBoard[index] = player

    // Update game state
    setGameState((prev) => ({
      ...prev,
      board: newBoard,
      currentPlayer: player === "X" ? "O" : "X",
    }))

    // Emit move to server
    if (socket) {
      socket.emit("makeMove", { index, board: newBoard })
    }

    // If playing against bot, simulate bot move
    if (gameState.isBot) {
      setTimeout(() => {
        const emptyCells = newBoard.map((cell, idx) => (cell === null ? idx : null)).filter((idx) => idx !== null)

        if (emptyCells.length > 0) {
          const botPlayer = player === "X" ? "O" : "X"
          const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)] as number

          const botBoard = [...newBoard]
          botBoard[randomCell] = botPlayer

          setGameState((prev) => ({
            ...prev,
            board: botBoard,
            currentPlayer: player,
          }))

          // Check for game end
          const winner = calculateWinner(botBoard)
          if (winner || !botBoard.includes(null)) {
            setTimeout(() => {
              setGameState((prev) => ({
                ...prev,
                status: "finished",
                result: winner ? (winner === player ? "win" : "lose") : "draw",
              }))

              // Show toast based on result
              if (winner === player) {
                toast({
                  title: "You won!",
                  description: `You've won ₹${betAmount * 2}`,
                })
              } else if (winner === botPlayer) {
                toast({
                  title: "You lost",
                  description: "Better luck next time!",
                })
              } else {
                toast({
                  title: "It's a draw!",
                  description: "Your bet has been returned.",
                })
              }
            }, 500)
          }
        }
      }, 1000)
    }
  }

  // Calculate winner
  const calculateWinner = (board: (Player | null)[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }

    return null
  }

  // Generate random name for bot
  const generateRandomName = () => {
    const names = ["Alex", "Jamie", "Jordan", "Taylor", "Casey", "Riley", "Avery", "Quinn", "Morgan", "Skyler"]
    return names[Math.floor(Math.random() * names.length)]
  }

  // Render cell
  const renderCell = (index: number) => {
    const value = gameState.board[index]
    const isWinningCell = false // You can implement winning cell highlighting later

    return (
      <button
        className={`h-24 w-24 bg-white rounded-lg shadow-md border-2 flex items-center justify-center text-4xl font-bold transition-all transform hover:scale-105 ${
          !value && gameState.currentPlayer === player && gameState.status === "playing"
            ? "hover:bg-purple-50 cursor-pointer border-purple-200"
            : "border-gray-200"
        } ${isWinningCell ? "bg-green-100 border-green-400" : ""}`}
        onClick={() => handleCellClick(index)}
        disabled={!!value || gameState.status !== "playing" || gameState.currentPlayer !== player}
      >
        {value === "X" && <X className="h-12 w-12 text-purple-600" />}
        {value === "O" && <Circle className="h-12 w-12 text-pink-500" />}
      </button>
    )
  }

  // Render game result
  const renderGameResult = () => {
    if (gameState.status !== "finished") return null

    let title = ""
    let description = ""
    let icon = null

    if (gameState.result === "win") {
      title = "You Won!"
      description = `Congratulations! You've won ₹${betAmount * 2}`
      icon = <Trophy className="h-12 w-12 text-yellow-500" />
    } else if (gameState.result === "lose") {
      title = "You Lost"
      description = "Better luck next time!"
      icon = <AlertTriangle className="h-12 w-12 text-red-500" />
    } else {
      title = "It's a Draw!"
      description = "Your bet has been returned."
      icon = (
        <div className="flex">
          <X className="h-6 w-6 text-purple-600" />
          <Circle className="h-6 w-6 text-pink-500 -ml-1" />
        </div>
      )
    }

    return (
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10">
        <Card className="w-80 animate-in fade-in zoom-in duration-300">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2">{icon}</div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center gap-4">
            <Button onClick={joinGame}>Play Again</Button>
            <Button variant="outline" onClick={() => router.push("/games")}>
              Exit
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Tic Tac Toe</h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Game Board</span>
                  {gameState.status === "playing" && (
                    <span className="text-sm font-normal px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                      {gameState.currentPlayer === player ? "Your turn" : "Opponent's turn"}
                    </span>
                  )}
                </CardTitle>
                {gameState.opponent && <CardDescription>Playing against: {gameState.opponent}</CardDescription>}
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="grid grid-cols-3 gap-3 max-w-[380px] mx-auto">
                    {Array(9)
                      .fill(null)
                      .map((_, index) => (
                        <div key={index}>{renderCell(index)}</div>
                      ))}
                  </div>

                  {renderGameResult()}

                  {gameState.status === "waiting" && !isConnecting && !gameState.opponent && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                      <p className="text-lg mb-4">Waiting for opponent...</p>
                      <p className="text-sm text-muted-foreground mb-4">Bot will join in {10 - waitingTime} seconds</p>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                  )}

                  {isConnecting && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                      <p className="text-lg mb-4">Connecting to game...</p>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Game Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Choose your symbol</Label>
                  <RadioGroup
                    defaultValue="X"
                    value={player}
                    onValueChange={(value) => setPlayer(value as Player)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="X" id="symbol-x" />
                      <Label htmlFor="symbol-x" className="flex items-center">
                        <X className="h-4 w-4 mr-1" /> X
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="O" id="symbol-o" />
                      <Label htmlFor="symbol-o" className="flex items-center">
                        <Circle className="h-4 w-4 mr-1" /> O
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Bet Amount (₹)</Label>
                  <BetAmountSelector value={betAmount} onChange={setBetAmount} options={[2, 5, 10, 20, 50, 100]} />
                </div>

                <Button className="w-full" onClick={joinGame} disabled={gameState.status === "playing" || isConnecting}>
                  {gameState.status === "playing"
                    ? "Game in Progress"
                    : gameState.status === "finished"
                      ? "Play Again"
                      : isConnecting
                        ? "Connecting..."
                        : "Find Opponent"}
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Game Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p>Get three of your symbols in a row (horizontally, vertically, or diagonally) to win.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Win: Receive 2x your bet amount</li>
                  <li>Draw: Your bet is returned</li>
                  <li>Lose: Your bet is lost</li>
                </ul>
                <p className="text-muted-foreground">
                  If no opponent is found within 10 seconds, you'll play against an AI opponent.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
