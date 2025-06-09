import type { MongoClient } from "mongodb";

// 루트 디렉토리/src/type/global.d.t.ts
export {};

declare global {
  namespace globalThis {
    var _mongo: Promise<MongoClient> | undefined;
  }
}
