// app/(test-taking)/tests/[testId]/attempt/[attemptId]/results/page.tsx
"use client"

import { useEffect, useState } from "react"
import { ResultsSummary } from "./_components/ResultsSummary"
import { CategoryScores } from "./_components/CategoryScores"
import type { TestAttemptResult } from "@/types/tests/test-attempt"

interface ResultsPageProps {
  params: Promise<{
    attemptId: string
  }>
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const [results, setResults] = useState<TestAttemptResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attemptId, setAttemptId] = useState<string>("")

  // Handle the Promise params
  useEffect(() => {
    params.then(resolvedParams => {
      setAttemptId(resolvedParams.attemptId)
    })
  }, [params])

  // Fetch results when attemptId is available
  useEffect(() => {
    if (!attemptId) return

    async function fetchResults() {
      try {
        const response = await fetch(`/api/tests/attempt/${attemptId}/results`)
        if (!response.ok) {
          throw new Error("Failed to fetch results")
        }
        const data = await response.json()
        
        // Add this console.log to debug the response
        console.log('API Response:', data);
        
        // Check the exact structure of the response
        if (!data || data.error) {
          throw new Error(data.error || "Failed to load results")
        }
        
        setResults(data)
      } catch (err) {
        console.error('Error details:', err);
        setError(err instanceof Error ? err.message : "Failed to load results")
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [attemptId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Loading Results...</h2>
          <p className="text-muted-foreground">Please wait while we calculate your scores.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!results) return null

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <h1 className="text-2xl font-bold text-center mb-8">Test Results</h1>
      <ResultsSummary 
        totalScore={results.totalScore} 
        maxScore={results.maxScore} 
        percentageScore={results.percentageScore} 
      />
      <CategoryScores categoryScores={results.categoryScores} />
    </div>
  )
}