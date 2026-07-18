/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['mongoose', 'bcryptjs', 'cloudinary'],
};

export default nextConfig;
