// app/(test-taking)/tests/page.tsx
import { Metadata } from "next"
import { TestList } from "./components/TestList"

export const metadata: Metadata = {
  title: "Available Tests",
  description: "Browse and take available assessment tests",
}

export default function TestsPage() {
  return (
    <div className="container py-8 space-y-6">
      {/* Page Header */}
      {/* <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Available Tests</h1>
        <p className="text-muted-foreground">
          Browse through our collection of assessment tests. Select a test to view more details and begin your assessment.
        </p>
      </div> */}

      {/* Tests Grid with Pagination */}
      <TestList />
    </div>
  )
}