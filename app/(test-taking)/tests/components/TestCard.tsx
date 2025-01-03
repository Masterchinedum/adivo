"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button" 
import { Progress } from "@/components/ui/progress" // Make sure this import is correct
import { ArrowRight } from "lucide-react"
// import { cn } from "@/lib/utils"
import type { Test } from "@/types/tests/test"
import type { TestAttempt } from "@/types/tests/test-attempt"
import { getAttemptProgress } from "../utils/attempt"

interface TestCardProps {
  test: Test
  viewType?: "grid" | "list"
  attempt?: TestAttempt
}

export function TestCard({ test, attempt }: TestCardProps) {
  const progressInfo = attempt && getAttemptProgress(attempt)
  
  return (
    <Card className="flex flex-col h-full min-h-[400px] transition-all hover:shadow-md">
      <Link href={`/tests/${test.id}`} className="flex-1">
        <CardHeader>
          <CardTitle className="line-clamp-2 text-xl">
            {test.title}
          </CardTitle>
          {test.description && (
            <CardDescription className="line-clamp-2 mt-2">
              {test.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          {/* Categories with scrollable container */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 max-h-[80px] overflow-y-auto scrollbar-thin">
              {test.categories?.map((category) => (
                <Badge 
                  key={category.id} 
                  variant="secondary"
                  className="text-xs whitespace-nowrap"
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Progress section */}
          {attempt && attempt.status === "IN_PROGRESS" && progressInfo && (
            <div className="space-y-2">
              <Progress 
                value={progressInfo.progress}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {progressInfo.answeredQuestions} of {progressInfo.totalQuestions} questions completed
              </p>
            </div>
          )}
        </CardContent>
      </Link>
      
      <CardFooter className="border-t p-4 mt-auto">
        <Button className="w-full" asChild>
          <Link href={attempt ? `/tests/${test.id}/attempt/${attempt.id}` : `/tests/${test.id}`}>
            {attempt ? 'Continue Test' : 'Start Test'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}