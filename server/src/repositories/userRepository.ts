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

  // 조건으로 사용자 조회 (페이지네이션)
  async findByQuery(query: any, skip: number = 0, limit: number = 20) {
    return await UserModel.find(query).skip(skip).limit(limit);
  },

  // 조건으로 사용자 개수 조회
  async countByQuery(query: any) {
    return await UserModel.countDocuments(query);
  },

  // 모든 사용자 조회 (페이지네이션)
  async findAll(skip: number = 0, limit: number = 20) {
    return await UserModel.find({}).skip(skip).limit(limit);
  },

  // 전체 사용자 개수 조회
  async countAll() {
    return await UserModel.countDocuments({});
  },

  // 사용자 정보 업데이트
  async updateById(id: string, updateData: any) {
    return await UserModel.findByIdAndUpdate(id, updateData, { new: true });
  },
};
