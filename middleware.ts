import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    if (!pathname.startsWith('/admin')) return NextResponse.next()

    const auth = req.headers.get('authorization')
    if (!auth || !auth.startsWith('Basic ')) {
        return new NextResponse('Auth required', {
            status: 401,
            headers: { 'WWW-Authenticate': 'Basic realm="Admin"' }
        })
    }

    const decoded = Buffer.from(auth.split(' ')[1], 'base64').toString()
    const [user, pass] = decoded.split(':')
    if (user !== process.env.ADMIN_USER || pass !== process.env.ADMIN_PASS) {
        return new NextResponse('Forbidden', { status: 403 })
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*']
}




