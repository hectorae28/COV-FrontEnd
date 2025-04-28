// middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const config = {
    matcher: ['/Colegiado/:path*', '/PanelControl/:path*'],
};

export async function middleware(request) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const url = request.nextUrl.clone();

    if (!token) {
        url.pathname = '/Login';
        return NextResponse.redirect(url);
    }

    if (url.pathname.startsWith('/Colegiado') && (token.role !== 'Colegiados'  && token.role !== 'Admin')) {
        url.pathname = '/NotColegiado';
        return NextResponse.redirect(url);
    }
    if (url.pathname.startsWith('/PanelContro') && (token.role !== 'Personal_Administrativo' && token.role !== 'Admin')) {
        url.pathname = '/notfound';
        return NextResponse.redirect(url);
    }
    if (url.pathname.startsWith('/Login') && (token.role === 'Colegiados' || token.role === 'Personal_Administrativo' || token.role === 'Admin')) {
        if (token.role === 'Colegiados' || token.role === 'Admin') {
            url.pathname = '/Colegiado';
        } else if (token.role === 'Personal_Administrativo'|| token.role === 'Admin') {
            url.pathname = '/PanelControl';
        } else {
            url.pathname = '/Login';
        }
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
}
