"use client"

import { useCallback, useEffect, useState } from "react"
import { TestsPageHeader } from "./TestsPageHeader"
import { TestCard } from "./TestCard"
import { TestCardSkeleton } from "./TestCardSkeleton"
import { TestsPagination } from "./TestsPagination"
import { InProgressTests } from "./InProgressTests"
import { RecentlyTakenTests } from "./RecentlyTakenTests"
import { getPublicTests } from "@/lib/tests"
import type { Test } from "@/types/tests/test"
import type { TestAttempt } from "@/types/tests/test-attempt"

export function TestList() {
  const [tests, setTests] = useState<Test[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalTests, setTotalTests] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [inProgressAttempts, setInProgressAttempts] = useState<TestAttempt[]>([])
  const [recentAttempts, setRecentAttempts] = useState<TestAttempt[]>([])

  const fetchTests = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getPublicTests({ 
        page: currentPage.toString(),
        search: searchQuery 
      })
      setTests(data.tests)
      setTotalPages(data.totalPages)
      setTotalTests(data.totalTests)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tests')
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, searchQuery]) // Only depend on values needed for the API call

  const fetchUserAttempts = useCallback(async () => {
    try {
      const response = await fetch('/api/tests/attempts')
      if (!response.ok) throw new Error('Failed to fetch attempts')
      const data = await response.json()
      
      setInProgressAttempts(data.inProgress)
      setRecentAttempts(data.completed)
    } catch (error) {
      console.error('Failed to fetch user attempts:', error)
    }
  }, [])

  useEffect(() => {
    void fetchTests()
  }, [fetchTests]) // fetchTests now has stable dependencies

  useEffect(() => {
    void fetchUserAttempts()
  }, [fetchUserAttempts])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }, [])

  const listClassName = view === "grid" 
    ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    : "space-y-4"

  if (isLoading) {
    return (
      <div className={listClassName}>
        {Array.from({ length: 8 }).map((_, i) => (
          <TestCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-8">
      <TestsPageHeader
        totalTests={totalTests}
        onSearch={handleSearch}
        view={view}
        onViewChange={setView}
      />

      {/* Progress Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        <InProgressTests attempts={inProgressAttempts} />
        <RecentlyTakenTests attempts={recentAttempts} />
      </div>

      {/* Existing Tests Grid */}
      <div className={listClassName}>
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <TestCardSkeleton key={i} />
          ))
        ) : (
          tests.map((test) => (
            <TestCard 
              key={test.id} 
              test={test}
              viewType={view}
              attempt={inProgressAttempts.find(a => a.testId === test.id)}
            />
          ))
        )}
      </div>

      <TestsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}