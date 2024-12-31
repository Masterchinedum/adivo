import { Metadata } from "next"
import { notFound } from "next/navigation"
import { TestDetails } from "./components/TestDetails"
import { getPublicTest } from "@/lib/tests"

export const metadata: Metadata = {
  title: "Test Details",
  description: "View test details and start assessment"
}

interface PageProps {
  params: {
    testId: string
  }
}

export default async function TestPage({ params }: PageProps) {
  const response = await getPublicTest(params.testId)
  
  if (!response?.test) {
    notFound()
  }

  return (
    <div className="container py-8 space-y-8">
      <TestDetails test={response.test} attempts={response.attempts} />
    </div>
  )
}