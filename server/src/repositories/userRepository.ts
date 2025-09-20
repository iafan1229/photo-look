// server/src/repositories/userRepository.ts
const UserModel = require("../utils/schema/User");

// Repository 패턴 - 데이터 접근 로직만 분리
export const userRepository = {
  // 사용자 생성
  async create(userData: any) {
    return await new UserModel(userData).save();
  },

  // ID로 사용자 조회
  async findById(id: string) {
    return await UserModel.findById(id);
  },

  // 조건으로 사용자 조회
  async findByQuery(query: any) {
    return await UserModel.find(query);
  },

  // 모든 사용자 조회
  async findAll() {
    return await UserModel.find({});
  },

  // 사용자 정보 업데이트
  async updateById(id: string, updateData: any) {
    return await UserModel.findByIdAndUpdate(id, updateData, { new: true });
  },
};
