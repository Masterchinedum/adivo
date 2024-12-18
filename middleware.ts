import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/api/webhook(.*)', 
  '/'
])

const isAdminRoute = createRouteMatcher(['/admindash(.*)'])

export default clerkMiddleware(async (auth, req) => {

  if (isPublicRoute(req)) {
      return NextResponse.next()
    }

    const { userId, redirectToSignIn } = await auth()

  // Protect all routes starting with `/admin`
  if (isAdminRoute(req) && (await auth()).sessionClaims?.metadata?.role !== 'admin') {
    const url = new URL('/404', req.url)
    return NextResponse.redirect(url)
  }
  // For other protected routes, redirect to sign-in if not logged in
  if (!userId) {
    return redirectToSignIn()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}