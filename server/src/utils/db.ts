const { MongoClient } = require("mongodb");

const url = `mongodb+srv://hydev:${process.env.DB_PASS}@photo-look.hne5f.mongodb.net/?retryWrites=true&w=majority&appName=photo-look`;
const options = { useNewUrlParser: true, useUnifiedTopology: true };
let connectDB;

if (process.env.NODE_ENV === "development") {
  let globalWithType = global as typeof globalThis & {
    _mongo: Promise<typeof MongoClient> | undefined;
  };
  // 개발 환경에서 연결 재사용 방지
  if (!globalWithType._mongo) {
    globalWithType._mongo = new MongoClient(url, options).connect();
  }
  connectDB = globalWithType._mongo;
} else {
  connectDB = new MongoClient(url, options).connect();
}

module.exports = { connectDB };
