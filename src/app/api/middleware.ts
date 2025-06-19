import { NextResponse } from 'next/server';
import type {NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';


const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(request: NextRequest) {
    const url = request.nextUrl
  const token = await getToken({ req: request, secret });

if(token &&  (url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up'))) {

  return NextResponse.redirect(new URL('/', request.url));
}
}

export const config = {
   matcher:["/sign-in","/sign-up" ]
}