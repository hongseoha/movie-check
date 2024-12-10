// /** @type {import('next').NextConfig} */

// const nextConfig = {
//   images: {
//     domains: ['sprint-fe-project.s3.ap-northeast-2.amazonaws.com'],
//   },
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sprint-fe-project.s3.ap-northeast-2.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/main',
        permanent: true, // true로 설정하면 SEO에도 좋음
      },
    ];
  },
};

export default nextConfig;