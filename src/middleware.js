// middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const config = {
    matcher: ['/Colegiado/:path*', '/PanelControl/:path*'],
};

export async function middleware(request) {
    // Extrae el token desde la cookie
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const url = request.nextUrl.clone();

    // Si no hay sesión, vas al login
    if (!token) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // “Colegiados” solo pueden entrar a /Colegiado
    if (url.pathname.startsWith('/Colegiados') && token.role !== 'Colegiados') {
        url.pathname = '/unauthorized';
        return NextResponse.redirect(url);
    }

    // “Personal_Administrativo” solo pueden entrar a /PanelControl
    if (url.pathname.startsWith('/PanelControl') && token.role !== 'Personal_Administrativo') {
        url.pathname = '/unauthorized';
        return NextResponse.redirect(url);
    }
    // Todo OK: continuar con la petición
    return NextResponse.next();
}
