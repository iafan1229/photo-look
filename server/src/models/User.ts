const mongooseModule = require("mongoose"); // 몽구스를 가져온다.

// 매거진 스키마 정의
const MagazineSchema = new mongooseModule.Schema({
  title: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    required: true,
  },
  style: {
    type: String,
    required: true,
  },
  analyzedImages: [
    {
      // dataUrl: String,
      name: String,
      analysis: {
        labels: [
          {
            description: String,
          },
        ],
      },
      storyText: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 사용자 스키마 정의
const UserSchema = new mongooseModule.Schema(
  {
    instagramId: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrls: {
      type: [String],
      required: true,
    },
    magazine: {
      type: MagazineSchema,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  }
);

const User = mongooseModule.model("User", UserSchema); // 스키마를 모델로 감싸준다.

module.exports = User; // 다른 곳에서도 사용할 수 있도록 export 해준다.
