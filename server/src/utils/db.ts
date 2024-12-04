// const { MongoClient } = require("mongodb");
var mongoose = require("mongoose");

const url = `mongodb+srv://hydev:${process.env.DB_PASS}@photo-look.hne5f.mongodb.net/?retryWrites=true&w=majority&appName=photo-look`;
// const options = { useNewUrlParser: true, useUnifiedTopology: true };
let connectDB;

const connectToDatabase = async () => {
  if (process.env.NODE_ENV === "development") {
    // 개발 환경에서 연결 재사용 방지
    let globalWithType = global as typeof globalThis & {
      _mongo: Promise<typeof mongoose> | undefined;
    };
    if (!globalWithType._mongo) {
      globalWithType._mongo = mongoose.connect(url);
    }
    connectDB = globalWithType._mongo;
  } else {
    connectDB = mongoose.connect(url);
  }

  return connectDB;
};

// 연결을 비동기적으로 처리하는 함수 호출
module.exports = {
  connectDB: connectToDatabase,
};
