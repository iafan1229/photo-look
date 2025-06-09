// 루트 디렉토리/src/type/global.d.t.ts
export {};

declare global {
  var _mongo: Promise<MongoClient> | undefined;
}
