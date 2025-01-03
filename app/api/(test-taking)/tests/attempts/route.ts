// app/api/(test-taking)/tests/attempts/route.ts

import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const attempts = await prisma.testAttempt.findMany({
      where: {
        userId: user.id
      },
      include: {
        test: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: {
        startedAt: 'desc'
      }
    })

    const inProgress = attempts.filter(a => a.status === "IN_PROGRESS")
    const completed = attempts
      .filter(a => a.status === "COMPLETED")
      .slice(0, 5)

    return NextResponse.json({ inProgress, completed })

  } catch (error) {
    console.error("[TEST_ATTEMPTS_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}