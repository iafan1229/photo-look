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
};

module.exports = nextConfig;
// module.exports = () => {
//   const nextConfig = {
//     sassOptions: {
//       includePaths: [path.join(__dirname, "styles")],
//     },
//   };

//   const rewrites = () => {
//     return [
//       {
//         source: "/api/:path*",
//         destination: "http://localhost:8080/api/:path*",
//       },
//     ];
//   };
//   return {
//     option: nextConfig,
//     rewrites,
//   };
// };
