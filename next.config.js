/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
            config.resolve.fallback = {
                fs: false,
                net: false
            }
        }

        return config;
    },
    // async redirects() {
    //     return [
    //         {
    //             source: '/',
    //             destination: '/pay',
    //             permanent: true,
    //         },
    //     ]
    // },
}

module.exports = nextConfig
