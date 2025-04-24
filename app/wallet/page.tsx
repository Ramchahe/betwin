"use client"

import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown, Plus, Wallet, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface Transaction {
  id: string
  type: "deposit" | "withdraw" | "bet" | "win" | "bonus"
  amount: number
  game?: string
  date: Date
  status: "completed" | "pending" | "failed"
}

export default function WalletPage() {
  const [balance, setBalance] = useState(0)
  const [bonus, setBonus] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate fetching wallet data
    const fetchWallet = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Get bonus from localStorage (set during registration)
        const storedBonus = localStorage.getItem("wallet_bonus")
        const bonusAmount = storedBonus ? Number.parseInt(storedBonus) : 0

        // For demo purposes, we'll set some sample data
        setBalance(100)
        setBonus(bonusAmount)
        setTransactions([
          {
            id: "1",
            type: "deposit",
            amount: 100,
            date: new Date(Date.now() - 86400000), // 1 day ago
            status: "completed",
          },
          {
            id: "2",
            type: "bet",
            amount: 10,
            game: "TicTacToe",
            date: new Date(Date.now() - 43200000), // 12 hours ago
            status: "completed",
          },
          {
            id: "3",
            type: "win",
            amount: 20,
            game: "TicTacToe",
            date: new Date(Date.now() - 43100000), // 12 hours ago
            status: "completed",
          },
          {
            id: "4",
            type: "bonus",
            amount: bonusAmount,
            date: new Date(Date.now() - 3600000), // 1 hour ago
            status: "completed",
          },
        ])
      } catch (error) {
        toast({
          title: "Error loading wallet",
          description: "There was a problem loading your wallet information.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchWallet()
  }, [toast])

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowUp className="h-4 w-4 text-green-500" />
      case "withdraw":
        return <ArrowDown className="h-4 w-4 text-red-500" />
      case "bet":
        return <ArrowDown className="h-4 w-4 text-orange-500" />
      case "win":
        return <ArrowUp className="h-4 w-4 text-green-500" />
      case "bonus":
        return <Plus className="h-4 w-4 text-purple-500" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">My Wallet</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Main Balance
              </CardTitle>
              <CardDescription className="text-purple-100">Available for betting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{balance.toFixed(2)}</div>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full">
                Add Funds
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Bonus Balance
              </CardTitle>
              <CardDescription>Promotional credits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{bonus.toFixed(2)}</div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">Bonus credits can be used for betting</p>
            </CardFooter>
          </Card>

          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button className="w-full">Deposit</Button>
              <Button variant="outline" className="w-full">
                Withdraw
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="deposits">Deposits & Withdrawals</TabsTrigger>
            <TabsTrigger value="bets">Bets & Wins</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>View all your recent transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-muted p-2 rounded-full">{getTransactionIcon(transaction.type)}</div>
                          <div>
                            <p className="font-medium capitalize">
                              {transaction.type === "bet" || transaction.type === "win"
                                ? `${transaction.type} on ${transaction.game}`
                                : transaction.type}
                            </p>
                            <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-medium ${
                              transaction.type === "deposit" ||
                              transaction.type === "win" ||
                              transaction.type === "bonus"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.type === "deposit" ||
                            transaction.type === "win" ||
                            transaction.type === "bonus"
                              ? `+₹${transaction.amount.toFixed(2)}`
                              : `-₹${transaction.amount.toFixed(2)}`}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">{transaction.status}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">No transactions found</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deposits">
            <Card>
              <CardHeader>
                <CardTitle>Deposits & Withdrawals</CardTitle>
                <CardDescription>View your deposit and withdrawal history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.filter((t) => t.type === "deposit" || t.type === "withdraw" || t.type === "bonus")
                    .length > 0 ? (
                    transactions
                      .filter((t) => t.type === "deposit" || t.type === "withdraw" || t.type === "bonus")
                      .map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="bg-muted p-2 rounded-full">{getTransactionIcon(transaction.type)}</div>
                            <div>
                              <p className="font-medium capitalize">{transaction.type}</p>
                              <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-medium ${
                                transaction.type === "deposit" || transaction.type === "bonus"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.type === "deposit" || transaction.type === "bonus"
                                ? `+₹${transaction.amount.toFixed(2)}`
                                : `-₹${transaction.amount.toFixed(2)}`}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">{transaction.status}</p>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">No deposits or withdrawals found</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bets">
            <Card>
              <CardHeader>
                <CardTitle>Bets & Wins</CardTitle>
                <CardDescription>View your betting history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.filter((t) => t.type === "bet" || t.type === "win").length > 0 ? (
                    transactions
                      .filter((t) => t.type === "bet" || t.type === "win")
                      .map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="bg-muted p-2 rounded-full">{getTransactionIcon(transaction.type)}</div>
                            <div>
                              <p className="font-medium capitalize">
                                {transaction.type} on {transaction.game}
                              </p>
                              <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-medium ${
                                transaction.type === "win" ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {transaction.type === "win"
                                ? `+₹${transaction.amount.toFixed(2)}`
                                : `-₹${transaction.amount.toFixed(2)}`}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">{transaction.status}</p>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">No bets or wins found</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
