// app/(test-taking)/tests/components/InProgressTests.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { getAttemptProgress } from "../utils/attempt"
import type { TestAttempt } from "@/types/tests/test-attempt"

interface InProgressTestsProps {
  attempts: TestAttempt[]
}

export function InProgressTests({ attempts }: InProgressTestsProps) {
  if (!attempts.length) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Continue Test</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {attempts.map((attempt) => {
          const { answeredQuestions, totalQuestions, progress } = getAttemptProgress(attempt)
          
          return (
            <div key={attempt.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{attempt.test?.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {answeredQuestions} of {totalQuestions} questions completed
                  </p>
                </div>
                <Button asChild size="sm">
                  <Link href={`/tests/${attempt.test?.id}/attempt/${attempt.id}`}>
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}