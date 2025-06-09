// app/utils/database.ts

import { MongoClient } from "mongodb";

const url = `mongodb+srv://hydev:${process.env.DB_PASS}@photo-look.hne5f.mongodb.net/?retryWrites=true&w=majority&appName=photo-look`;
const options: any = { useNewUrlParser: true };
let connectDB: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // 개발 중 재실행을 막음
  if (!global._mongo) {
    global._mongo = new MongoClient(url, options).connect();
  }
  connectDB = global._mongo;
} else {
  connectDB = new MongoClient(url, options).connect();
}

export { connectDB };
