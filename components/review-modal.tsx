"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function ReviewModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [review, setReview] = useState("")
  const { toast } = useToast()

  // Open modal when the button with data-review-modal="open" is clicked
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const button = target.closest('[data-review-modal="open"]')
      if (button) {
        setIsOpen(true)
      }
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would normally send the review to your backend
    console.log({ rating, review })

    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback!",
    })

    setIsOpen(false)
    setRating(0)
    setReview("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Leave a Review</h3>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <p className="mb-2 font-medium">Your Rating</p>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      (hoverRating || rating) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="review" className="block mb-2 font-medium">
              Your Review
            </label>
            <Textarea
              id="review"
              placeholder="Share your experience with us..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={rating === 0 || !review.trim()}>
              Submit Review
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
