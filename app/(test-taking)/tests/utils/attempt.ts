// app/(test-taking)/tests/utils/attempt.ts
import type { TestAttempt } from "@/types/tests/test-attempt"

export function getAttemptProgress(attempt: TestAttempt) {
  const answeredQuestions = attempt.responses?.length ?? 0
  const totalQuestions = attempt.test?._count?.questions ?? 0
  return {
    answeredQuestions,
    totalQuestions,
    progress: totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0
  }
}