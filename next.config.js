/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  env: {
    NEXT_PUBLIC_BASIC_AUTH_USERNAME:
      process.env.NEXT_PUBLIC_BASIC_AUTH_USERNAME,
    NEXT_PUBLIC_BASIC_AUTH_PASSWORD:
      process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD,
  },
  nextConfig,
};
