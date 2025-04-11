const path = require("path");
/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  rewrites: () => {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/:path*",
      },
      {
        source: "/front/api/:path*",
        destination: "http://localhost:5000/api/:path*",
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
    loader: "custom",
    loaderFile: "./my-image-loader.ts",
  },
};

module.exports = nextConfig;
