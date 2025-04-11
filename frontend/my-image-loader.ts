// my-image-loader.js
module.exports = function myImageLoader({ src }: { src: string }) {
  console.log(src);
  // 직접 URL 구성 (인코딩 없이)
  return `${src}
  `;
};
