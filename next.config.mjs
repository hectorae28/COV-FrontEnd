/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'host.docker.internal',
                port: '8000',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'romance-suggestion-pam-boxed.trycloudflare.com',
                pathname: '/**',
                port: '80',
            },
            {
                protocol: 'https',
                hostname: 'composite-broadband-root-accordance.trycloudflare.com',
                pathname: '/**',
            },
            {
                //https://horizon-deemed-moss-principles.trycloudflare.com
                protocol: 'https',
                hostname: 'horizon-deemed-moss-principles.trycloudflare.com',
                pathname: '/**',
            },
            {
                protocol:"http",
                hostname:"192.168.100.242",
                port: '8000',
                pathname: '/**',
            }
        ],
    },
};;

export default nextConfig;
