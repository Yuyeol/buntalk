import {
  NextFetchEvent,
  NextRequest,
  NextResponse,
  userAgent,
} from 'next/server'

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  // const ua = userAgent(req)
  // if (ua?.isBot) {
  //   return new Response("You're a bot!", { status: 403 })
  // }
  // if (!req.url.includes('/api')) {
  //   if (!req.url.includes('/enter') && !req.cookies.has('carrotsession'))
  //     return NextResponse.redirect('/enter')
  // }
}
