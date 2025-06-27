/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Suppress specific warnings
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // Suppress console warnings in development
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config, { dev, isServer }) => {
      if (dev && !isServer) {
        // Suppress specific console warnings
        const originalConsoleWarn = console.warn;
        console.warn = (...args) => {
          const message = args.join(' ');
          // Skip params-related warnings
          if (message.includes('param property was accessed directly') || 
              message.includes('params is now a Promise')) {
            return;
          }
          originalConsoleWarn.apply(console, args);
        };
      }
      return config;
    },
  }),
}

export default nextConfig
