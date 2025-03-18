"use server"

import type { OpenRouterResponse } from "./types"

export async function generateAIAffirmation(topic: string): Promise<string> {
  try {
    // Don't make API calls if no topic is provided
    if (!topic || topic.trim() === "") {
      return "Please enter what you need an affirmation about to get started."
    }

    const prompt = `Generate a positive, uplifting, and motivational affirmation about "${topic}". 
    The affirmation should be personal (using "I" statements), present tense, and positive. 
    Keep it concise (1-2 sentences) and impactful. 
    Do not include any prefixes, just return the affirmation text itself.`

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://vercel.com/",
        "X-Title": "Daily Affirmation Generator",
      },
      body: JSON.stringify({
        model: "openchat/openchat-7b:free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("API Error:", errorData)
      throw new Error(`API error: ${response.status}`)
    }

    const data: OpenRouterResponse = await response.json()

    // Extract the affirmation from the response
    const affirmation =
      data.choices[0]?.message?.content?.trim() ||
      "I am capable of overcoming challenges and finding success in all areas of my life."

    // Clean up the affirmation (remove quotes if present)
    return affirmation.replace(/^["'](.*)["']$/, "$1")
  } catch (error) {
    console.error("Error generating affirmation:", error)
    return "I believe in my ability to grow and overcome challenges, even when technology fails me."
  }
}

