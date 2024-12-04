const mongoose = require("mongoose"); // 몽구스를 가져온다.
const { Schema } = mongoose;

const userSchema = new Schema({
  // name: {
  //   type: String,
  //   maxlength: 50,
  // },
  id: {
    type: String,
    trim: true,
    unique: 1,
  },
  // photos: [{ id: String }],
  // date: [{ startDate: String, endDate: String }],
  password: {
    type: String,
    minlength: 5,
  },
});

const User = mongoose.model("user-info", userSchema); // 스키마를 모델로 감싸준다.

module.exports = User; // 다른 곳에서도 사용할 수 있도록 export 해준다.
