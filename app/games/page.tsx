import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function GamesPage() {
  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Games</h1>
        <p className="text-muted-foreground mb-8">Choose a game and start winning!</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="overflow-hidden hover:shadow-lg transition-all">
            <div className="relative h-48">
              <Image src="/images/tictactoe.png" alt="Tic Tac Toe" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-white text-xl font-bold">Tic Tac Toe</h2>
                <p className="text-white/80 text-sm">Play against other users or AI</p>
              </div>
            </div>
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                Challenge other players in real-time or play against our smart AI. Get three in a row to win!
              </p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Bet Range</p>
                  <p className="text-sm text-muted-foreground">₹2 - ₹100</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Win</p>
                  <p className="text-sm text-green-600">2x Bet</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/games/tictactoe" className="w-full">
                <Button className="w-full">
                  Play Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden hover:shadow-lg transition-all">
            <div className="relative h-48">
              <Image src="/images/aviator.png" alt="Aviator" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-white text-xl font-bold">Aviator</h2>
                <p className="text-white/80 text-sm">Cash out before the plane flies away</p>
              </div>
            </div>
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                Watch the multiplier rise and cash out before the plane flies away! The longer you wait, the higher the
                potential reward.
              </p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Bet Range</p>
                  <p className="text-sm text-muted-foreground">₹2 - ₹100</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Win</p>
                  <p className="text-sm text-green-600">Up to 10x Bet</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/games/aviator" className="w-full">
                <Button className="w-full">
                  Play Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden hover:shadow-lg transition-all">
            <div className="relative h-48">
              <Image src="/images/color-prediction.png" alt="Color Prediction" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-white text-xl font-bold">Color Prediction</h2>
                <p className="text-white/80 text-sm">Predict red or green and win instantly</p>
              </div>
            </div>
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                Predict if the next color will be red or green and win instantly. Simple, fast, and exciting!
              </p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Bet Range</p>
                  <p className="text-sm text-muted-foreground">₹2 - ₹100</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Win</p>
                  <p className="text-sm text-green-600">2x Bet</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/games/color-prediction" className="w-full">
                <Button className="w-full">
                  Play Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">More Games Coming Soon!</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            We're constantly working on adding new and exciting games to our platform. Stay tuned for more opportunities
            to play and win!
          </p>
          <Link href="/wallet">
            <Button size="lg">Check Your Wallet</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
