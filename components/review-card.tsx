import Image from "next/image"
import { Star } from "lucide-react"

interface ReviewCardProps {
  name: string
  avatar: string
  rating: number
  date: string
  review: string
}

export default function ReviewCard({ name, avatar, rating, date, review }: ReviewCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
      <div className="flex items-center mb-4">
        <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
          <Image src={avatar || "/placeholder.svg"} alt={name} fill className="object-cover" />
        </div>
        <div>
          <h4 className="font-bold">{name}</h4>
          <p className="text-gray-500 text-sm">{date}</p>
        </div>
      </div>

      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
        ))}
      </div>

      <p className="text-gray-600">{review}</p>
    </div>
  )
}
