// app/(test-taking)/tests/components/TestsPageHeader.tsx
"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ViewToggle } from "./ViewToggle"

interface TestsPageHeaderProps {
  totalTests: number
  onSearch: (query: string) => void
  view: "grid" | "list"
  onViewChange: (view: "grid" | "list") => void
}

export function TestsPageHeader({ 
  totalTests, 
  onSearch, 
  view, 
  onViewChange 
}: TestsPageHeaderProps) {
  return (
    <div className="space-y-4 pb-4 border-b">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Available Tests</h1>
        <p className="text-muted-foreground">
          Browse and take tests from our collection of {totalTests} available tests
        </p>
      </div>
      
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm">
          <Label htmlFor="search" className="sr-only">Search tests</Label>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            type="search" 
            placeholder="Search tests..."
            className="pl-8"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        
        <ViewToggle view={view} onViewChange={onViewChange} />
      </div>
    </div>
  )
}