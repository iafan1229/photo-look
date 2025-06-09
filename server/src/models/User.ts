// server/src/models/User.ts
const mongooseModule = require("mongoose");

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
      name: String,
      labels: [
        {
          description: String,
        },
      ],
      storyText: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 사용자 스키마 정의 - 인스타그램 ID 대신 개인정보 필드 추가
const UserSchema = new mongooseModule.Schema(
  {
    // 개인정보 필드 추가
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    snsId: {
      type: String, // 선택 사항
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String, // 거절 사유
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

const User = mongooseModule.model("User", UserSchema);

module.exports = User;
