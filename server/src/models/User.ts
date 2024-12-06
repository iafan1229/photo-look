const mongooseModule = require("mongoose"); // 몽구스를 가져온다.

const UserSchema = new mongooseModule.Schema({
  name: String,
  instagramId: String,
  email: String,
  upload: [String],
  date: [String],
  password: String,
  textarea: String,
});

const User = mongooseModule.model("User", UserSchema); // 스키마를 모델로 감싸준다.

module.exports = User; // 다른 곳에서도 사용할 수 있도록 export 해준다.
