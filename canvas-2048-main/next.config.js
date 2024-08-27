/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (dev) {
      Object.defineProperty(config, 'devtool', {
        get() {
            return "cheap-source-map";
        },
        set() {},
    });
    }
    return config;
  }
};

module.exports = nextConfig;
