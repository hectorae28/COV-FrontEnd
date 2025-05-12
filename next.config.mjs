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
                protocol: "http",
                hostname: "192.168.100.242",
                port: '8000',
                pathname: '/**',
            }
        ],
    },
    // Añadimos configuración para compatibilidad
    webpack: (config, { dev, isServer }) => {
        // Configuraciones para mejorar compatibilidad con navegadores
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
            };
        }
        return config;
    },
};

export default nextConfig;