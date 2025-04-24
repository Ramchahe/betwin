import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface GameCardProps {
  title: string
  description: string
  image: string
  link: string
  minBet: number
  maxBet: number
}

export default function GameCard({ title, description, image, link, minBet, maxBet }: GameCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
          <h3 className="text-white font-bold text-xl">{title}</h3>
          <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm">
            ₹{minBet} - ₹{maxBet}
          </Badge>
        </div>
      </div>

      <div className="p-5">
        <p className="text-gray-600 mb-4">{description}</p>
        <Link href={link}>
          <Button className="w-full group-hover:bg-purple-700 transition-colors">
            Play Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
