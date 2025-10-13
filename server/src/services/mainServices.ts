// server/src/services/mainService.ts
import { userRepository } from "../repositories/userRepository";

export const mainService = {
  // 전체 매거진 목록 조회 비즈니스 로직 (페이지네이션)
  async getAllMagazines(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const allData = await userRepository.findAll(skip, limit);
    const total = await userRepository.countAll();
    
    return {
      magazines: allData,
      total: total,
    };
  },

  // 검색 조건에 따른 매거진 조회 비즈니스 로직 (페이지네이션)
  async searchMagazines(searchParams: {
    name?: string;
    sns?: string;
    title?: string;
  }, page: number = 1, limit: number = 20) {
    // 검색 쿼리 생성 로직 (비즈니스 로직)
    const searchQuery = buildSearchQuery(searchParams);
    const skip = (page - 1) * limit;

    const results = await userRepository.findByQuery(searchQuery, skip, limit);
    const total = await userRepository.countByQuery(searchQuery);

    return {
      magazines: results,
      total: total,
      searchCriteria: searchParams,
    };
  },

  //   // 슬라이더용 데이터 조회 비즈니스 로직 (현재는 비어있음)
  //   async getSliderData() {
  //     // 향후 슬라이더 기능 구현시 비즈니스 로직 추가
  //     // 예: 최신 매거진 5개, 인기 매거진 등
  //     return [];
  //   },
};

function buildSearchQuery(searchParams: {
  name?: string;
  sns?: string;
  title?: string;
}) {
  let searchQuery: any = {};

  // 이름 검색 - 대소문자 구분 없이 부분 일치
  if (searchParams.name) {
    searchQuery.name = { $regex: searchParams.name, $options: "i" };
  }

  // SNS 아이디 검색
  if (searchParams.sns) {
    searchQuery.sns = { $regex: searchParams.sns, $options: "i" };
  }

  // 매거진 제목 검색
  if (searchParams.title) {
    searchQuery["magazine.title"] = {
      $regex: searchParams.title,
      $options: "i",
    };
  }

  return searchQuery;
}

//   // 슬라이더용 데이터 조회 비즈니스 로직 (현재는 비어있음)
//   async getSliderData() {
//     // 향후 슬라이더 기능 구현시 비즈니스 로직 추가
//     // 예: 최신 매거진 5개, 인기 매거진 등
//     return [];
//   }
