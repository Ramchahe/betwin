"use client"

import { useState, useEffect } from "react"
import { Trophy, Users, ArrowUp, ArrowDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface LeaderboardUser {
  id: number
  name: string
  avatar: string
  winnings: number
  gamesPlayed: number
  winRate: number
  rank: number
  previousRank: number
}

export default function LeaderboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly" | "allTime">("weekly")

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate mock data
      const mockUsers = [
        {
          id: 1,
          name: "Rahul Sharma",
          avatar: "/images/avatar-1.png",
          winnings: 12500,
          gamesPlayed: 78,
          winRate: 0.65,
          rank: 1,
          previousRank: 2,
        },
        {
          id: 2,
          name: "Priya Patel",
          avatar: "/images/avatar-2.png",
          winnings: 10800,
          gamesPlayed: 65,
          winRate: 0.72,
          rank: 2,
          previousRank: 1,
        },
        {
          id: 3,
          name: "Amit Kumar",
          avatar: "/images/avatar-3.png",
          winnings: 9200,
          gamesPlayed: 92,
          winRate: 0.58,
          rank: 3,
          previousRank: 5,
        },
        {
          id: 4,
          name: "Sneha Gupta",
          avatar: "/placeholder.svg",
          winnings: 8500,
          gamesPlayed: 54,
          winRate: 0.61,
          rank: 4,
          previousRank: 3,
        },
        {
          id: 5,
          name: "Vikram Singh",
          avatar: "/placeholder.svg",
          winnings: 7800,
          gamesPlayed: 47,
          winRate: 0.68,
          rank: 5,
          previousRank: 4,
        },
        {
          id: 6,
          name: "Neha Reddy",
          avatar: "/placeholder.svg",
          winnings: 6900,
          gamesPlayed: 63,
          winRate: 0.52,
          rank: 6,
          previousRank: 8,
        },
        {
          id: 7,
          name: "Rajesh Khanna",
          avatar: "/placeholder.svg",
          winnings: 6200,
          gamesPlayed: 41,
          winRate: 0.59,
          rank: 7,
          previousRank: 6,
        },
        {
          id: 8,
          name: "Ananya Desai",
          avatar: "/placeholder.svg",
          winnings: 5800,
          gamesPlayed: 38,
          winRate: 0.63,
          rank: 8,
          previousRank: 7,
        },
        {
          id: 9,
          name: "Karan Malhotra",
          avatar: "/placeholder.svg",
          winnings: 5100,
          gamesPlayed: 52,
          winRate: 0.48,
          rank: 9,
          previousRank: 10,
        },
        {
          id: 10,
          name: "Divya Sharma",
          avatar: "/placeholder.svg",
          winnings: 4700,
          gamesPlayed: 35,
          winRate: 0.57,
          rank: 10,
          previousRank: 9,
        },
      ]

      setLeaderboard(mockUsers)
      setIsLoading(false)
    }

    fetchLeaderboard()
  }, [timeframe])

  const getRankChangeIcon = (current: number, previous: number) => {
    if (current < previous) {
      return <ArrowUp className="h-4 w-4 text-green-500" />
    } else if (current > previous) {
      return <ArrowDown className="h-4 w-4 text-red-500" />
    }
    return null
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Leaderboard</h1>
            <p className="text-muted-foreground">See who's winning big on BetWin</p>
          </div>

          <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)} className="w-full md:w-auto">
            <TabsList className="grid grid-cols-4 w-full md:w-[400px]">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="allTime">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Top Winner
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isLoading && leaderboard.length > 0 && (
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-white">
                    <AvatarImage src={leaderboard[0].avatar || "/placeholder.svg"} alt={leaderboard[0].name} />
                    <AvatarFallback>{leaderboard[0].name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-lg">{leaderboard[0].name}</p>
                    <p className="text-yellow-100">₹{leaderboard[0].winnings.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5" />
                Total Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,248</div>
              <p className="text-sm text-muted-foreground">+12% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">Total Winnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹1,24,500</div>
              <p className="text-sm text-muted-foreground">Across all games</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">Games Played</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8,432</div>
              <p className="text-sm text-muted-foreground">This {timeframe}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Players</CardTitle>
            <CardDescription>
              Players ranked by total winnings for {timeframe === "allTime" ? "all time" : timeframe}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Rank</th>
                      <th className="text-left py-3 px-4">Player</th>
                      <th className="text-right py-3 px-4">Winnings</th>
                      <th className="text-right py-3 px-4 hidden md:table-cell">Games</th>
                      <th className="text-right py-3 px-4 hidden md:table-cell">Win Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <span
                              className={`font-bold ${
                                user.rank === 1
                                  ? "text-yellow-500"
                                  : user.rank === 2
                                    ? "text-gray-500"
                                    : user.rank === 3
                                      ? "text-amber-700"
                                      : ""
                              }`}
                            >
                              {user.rank}
                            </span>
                            {getRankChangeIcon(user.rank, user.previousRank)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">₹{user.winnings.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right hidden md:table-cell">{user.gamesPlayed}</td>
                        <td className="py-3 px-4 text-right hidden md:table-cell">
                          {(user.winRate * 100).toFixed(0)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">Don't see your name? Keep playing to climb the ranks!</p>
          <Button asChild>
            <a href="/games">Play Games</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
