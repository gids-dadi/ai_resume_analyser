// stores/useFeedbackStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Tip = {
    type: 'good' | 'improve'
    tip: string
    explanation?: string
}

type Feedback = {
    overallScore: number
    ATS: {
        score: number
        tips: Tip[]
    }
    toneAndStyle: {
        score: number
        tips: Tip[]
    }
    content: {
        score: number
        tips: Tip[]
    }
    structure: {
        score: number
        tips: Tip[]
    }
    skills: {
        score: number
        tips: Tip[]
    }
    likelyInterviewQuestions: {
        question: string
        answer: string
    }[]  // This should be an array
}

type FeedbackStore = {
    feedback: Feedback | null
    setFeedbackToStore: (data: Feedback) => void
    clearFeedback: () => void  // Added clear function
}

export const useFeedbackStore = create<FeedbackStore>()(
    persist(
        (set) => ({
            feedback: null,
            setFeedbackToStore: (data) => set({ feedback: data }),
            clearFeedback: () => set({ feedback: null }),
        }),
        {
            name: 'feedback-store', // localStorage key
            storage: createJSONStorage(() => localStorage), // Explicit storage
        }
    )
)