/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['vitruveo-studio-qa-assets.s3.amazonaws.com', 'vitruveo-studio-production-assets.s3.amazonaws.com'],
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/login',
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;
