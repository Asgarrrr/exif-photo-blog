import { auth } from './src/auth/server';
import { NextRequest, NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  PATH_ADMIN,
  PATH_ADMIN_PHOTOS,
  PATH_OG,
  PATH_OG_SAMPLE,
  PREFIX_PHOTO,
  PREFIX_TAG,
} from './src/app/path';

export default function middleware(req: NextRequest, res:NextResponse) {
  const pathname = req.nextUrl.pathname;
  const baseUrl = req.nextUrl.origin || req.url;

  if (pathname === PATH_ADMIN) {
    return NextResponse.redirect(new URL(PATH_ADMIN_PHOTOS, baseUrl));
  } else if (pathname === PATH_OG) {
    return NextResponse.redirect(new URL(PATH_OG_SAMPLE, baseUrl));
  } else if (/^\/photos\/(.)+$/.test(pathname)) {
    // Accept /photos/* paths, but serve /p/*
    const matches = pathname.match(/^\/photos\/(.+)$/);
    return NextResponse.rewrite(new URL(
      `${PREFIX_PHOTO}/${matches?.[1]}`,
      baseUrl,
    ));
  } else if (/^\/t\/(.)+$/.test(pathname)) {
    // Accept /t/* paths, but serve /tag/*
    const matches = pathname.match(/^\/t\/(.+)$/);
    return NextResponse.rewrite(new URL(
      `${PREFIX_TAG}/${matches?.[1]}`,
      baseUrl,
    ));
  }

  return auth(
		req as unknown as NextApiRequest,
		res as unknown as NextApiResponse,
  );
}

export const config = {
  //  Excludes:
  // - /api + /api/auth*
  // - /_next/static*
  // - /_next/image*
  // - /favicon.ico + /favicons/*
  // - /grid
  // - /full
  // - / (root)
  // - /home-image
  // - /template-image
  // - /template-image-tight
  // - /template-url
	 
  matcher: [
    '/((?!api$|api/auth|_next/static|_next/image|favicon.ico$|favicons/|grid$|full$|home-image$|template-image$|template-image-tight$|template-url$|$).*)',
  ],
};
