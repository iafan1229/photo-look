const path = require("path");
/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  rewrites: () => {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "photolookbucket.s3.ap-northeast-2.amazonaws.com",
        port: "",
        pathname: "/img-upload/**",
      },
    ],
  },
};

module.exports = nextConfig;
