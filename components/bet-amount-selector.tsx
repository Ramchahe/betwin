"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface BetAmountSelectorProps {
  value: number
  onChange: (value: number) => void
  options: number[]
  disabled?: boolean
}

export default function BetAmountSelector({ value, onChange, options, disabled = false }: BetAmountSelectorProps) {
  const [customAmount, setCustomAmount] = useState("")

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomAmount(value)
  }

  const handleCustomAmountBlur = () => {
    const amount = Number.parseFloat(customAmount)
    if (!isNaN(amount) && amount > 0) {
      onChange(amount)
    } else {
      setCustomAmount("")
    }
  }

  const handleCustomAmountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCustomAmountBlur()
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {options.map((amount) => (
          <Button
            key={amount}
            type="button"
            variant={value === amount ? "default" : "outline"}
            onClick={() => onChange(amount)}
            disabled={disabled}
            className="font-medium"
          >
            ₹{amount}
          </Button>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Custom amount"
          value={customAmount}
          onChange={handleCustomAmountChange}
          onBlur={handleCustomAmountBlur}
          onKeyDown={handleCustomAmountKeyDown}
          disabled={disabled}
          min="1"
          step="1"
        />
        <Button type="button" variant="outline" onClick={handleCustomAmountBlur} disabled={disabled || !customAmount}>
          Set
        </Button>
      </div>
    </div>
  )
}
