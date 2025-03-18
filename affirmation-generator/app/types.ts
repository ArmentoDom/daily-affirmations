export interface OpenRouterResponse {
  id: string
  choices: {
    message: {
      role: string
      content: string
    }
    index: number
    finish_reason: string
  }[]
  model: string
  created: number
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface SavedAffirmation {
  id: string
  text: string
  topic: string
  timestamp: number
}

