"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, RefreshCw, Sparkles } from "lucide-react"
import confetti from "canvas-confetti"
import { generateAIAffirmation } from "./actions"
import type { SavedAffirmation } from "./types"
import { Skeleton } from "@/components/ui/skeleton"

export default function AffirmationGenerator() {
  const [currentAffirmation, setCurrentAffirmation] = useState("")
  const [topic, setTopic] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [favorites, setFavorites] = useState<SavedAffirmation[]>([])

  // Generate a personalized affirmation based on the topic
  const generateAffirmation = async () => {
    if (!topic) {
      setCurrentAffirmation("Enter what you need an affirmation about to get started.")
      return
    }

    setIsLoading(true)

    try {
      // Call the server action to generate an AI affirmation
      const affirmation = await generateAIAffirmation(topic)
      setCurrentAffirmation(affirmation)
      setIsFavorite(false)

      // Trigger confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    } catch (error) {
      console.error("Error generating affirmation:", error)
      setCurrentAffirmation("I am resilient even when technology fails me.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() === "") return

    setTopic(inputValue)
    await generateAffirmation()
  }

  // Toggle favorite status
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)

    if (!isFavorite && currentAffirmation) {
      const newFavorite: SavedAffirmation = {
        id: Date.now().toString(),
        text: currentAffirmation,
        topic: topic,
        timestamp: Date.now(),
      }

      setFavorites([...favorites, newFavorite])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-800 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      {/* Floating elements for depth */}
      <div className="absolute top-20 left-[10%] w-24 h-24 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-xl animate-float-slow"></div>
      <div className="absolute bottom-20 right-[15%] w-32 h-32 bg-gradient-to-br from-blue-300/20 to-indigo-300/20 rounded-full blur-xl animate-float-medium"></div>
      <div className="absolute top-1/3 right-[20%] w-16 h-16 bg-gradient-to-br from-yellow-300/20 to-orange-300/20 rounded-full blur-xl animate-float-fast"></div>

      <div className="max-w-2xl w-full space-y-8 z-10">
        <div className="text-center space-y-2">
          <div className="relative inline-block">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 text-transparent bg-clip-text drop-shadow-sm">
              Daily Affirmation
            </h1>
            <div className="absolute -top-6 -right-6 text-yellow-400 animate-pulse-slow">
              <Sparkles size={24} />
            </div>
          </div>
          <p className="text-muted-foreground text-lg">AI-powered positive thoughts for a positive life</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex gap-2 mb-6">
          <Input
            type="text"
            placeholder="What do you need an affirmation about today?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="rounded-full border-2 border-gray-200 dark:border-gray-700 shadow-inner bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm py-6 px-6 text-lg"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="rounded-full px-6 py-6 text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 dark:from-indigo-500 dark:to-purple-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            disabled={isLoading || inputValue.trim() === ""}
          >
            Generate
          </Button>
        </form>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentAffirmation || "loading"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border border-gray-200/50 dark:border-gray-700/50 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5"></div>
              <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              <CardContent className="p-8 md:p-10 relative">
                <div className="flex flex-col items-center space-y-8">
                  <div className="h-40 flex items-center justify-center relative">
                    {isLoading ? (
                      <div className="space-y-4 w-full max-w-md">
                        <Skeleton className="h-6 w-full bg-gray-200/70 dark:bg-gray-700/70" />
                        <Skeleton className="h-6 w-5/6 mx-auto bg-gray-200/70 dark:bg-gray-700/70" />
                        <Skeleton className="h-6 w-4/6 mx-auto bg-gray-200/70 dark:bg-gray-700/70" />
                      </div>
                    ) : (
                      <div className="relative">
                        <p className="text-xl md:text-2xl text-center font-medium text-primary leading-relaxed">
                          "{currentAffirmation || "Enter a topic to receive your personalized affirmation"}"
                        </p>
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-300 dark:via-purple-600 to-transparent"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-6">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleFavorite}
                      className="rounded-full w-12 h-12 transition-all duration-300 border-2 border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg hover:-translate-y-1 bg-white dark:bg-slate-800"
                      disabled={isLoading || !currentAffirmation}
                    >
                      <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>

                    <Button
                      onClick={generateAffirmation}
                      disabled={isLoading || !topic}
                      className="rounded-full px-8 py-6 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 dark:from-indigo-500 dark:to-purple-500"
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                          Generating...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <RefreshCw className="mr-2 h-5 w-5" />
                          New Affirmation
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

