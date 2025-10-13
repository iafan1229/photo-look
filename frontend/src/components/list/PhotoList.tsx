import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { FetchUser, UserData as User } from "@/type/user";
import Masonry from "react-masonry-css";
import PhotoDetail from "@/components/detail/PhotoDetail";

interface PaginationInfo {
  currentPage: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export default function PhotoList({
  filterValue,
  searchValue,
}: {
  filterValue: string | undefined;
  searchValue: string;
}) {
  const [userData, setUserData] = useState<FetchUser[]>([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUserData, setDetailUserData] = useState<FetchUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagination?.hasMore) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, pagination?.hasMore]
  );

  const fetchData = async (page: number, isInitialLoad: boolean = false) => {
    if (loading && !isInitialLoad) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });

      if (filterValue && searchValue) {
        params.append(filterValue, searchValue);
      } else {
        params.append("total", "true");
      }

      const listResponse = await axios.get(
        `/api/main/list?${params.toString()}`
      );
      const { data, pagination: paginationInfo } = listResponse.data;

      if (isInitialLoad || page === 1) {
        setUserData(data);
      } else {
        setUserData((prev) => [...prev, ...data]);
      }

      setPagination(paginationInfo);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchData(1, true);
  }, [filterValue, searchValue]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchData(currentPage);
    }
  }, [currentPage]);

  const handleDetail = (el: FetchUser) => {
    setDetailOpen(!detailOpen);
    setDetailUserData(el);
  };

  // 반응형 브레이크포인트 설정
  const breakpointColumnsObj = {
    default: 4, // 기본 4열
    1100: 3, // 1100px 이하에서 3열
    700: 2, // 700px 이하에서 2열
    500: 1, // 500px 이하에서 1열
  };

  console.log(
    "hi",
    userData?.filter((el) => el.status === "approved")
  );

  return (
    <>
      {userData?.length && (
        <section>
          <div className='title'>
            <h1>Albums</h1>
          </div>
          <div className='list photos'>
            <div>
              <div
                className='masonry-wrap'
                style={{ display: "flex", flexWrap: "wrap", gap: 30 }}
              >
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className='my-masonry-grid'
                  columnClassName='my-masonry-grid_column'
                >
                  {userData
                    ?.filter((el) => el.status === "approved")
                    .map((el: FetchUser, i, array) => {
                      const isLast = i === array.length - 1;
                      return (
                        <div
                          key={`${el._id || i}`}
                          className='photo-wrap'
                          onClick={() => handleDetail(el)}
                          ref={isLast ? lastElementRef : null}
                        >
                          <div className='photo'>
                            <img
                              src={el?.imageUrls?.[0]}
                              alt=''
                              width={500}
                              height={500}
                            />
                          </div>
                          <div className='text'>
                            <div className='des'>{el?.magazine?.title}</div>
                          </div>
                        </div>
                      );
                    })}
                </Masonry>
              </div>
            </div>
          </div>

          {loading && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                fontSize: "16px",
                color: "#666",
              }}
            >
              로딩 중...
            </div>
          )}

          {!loading &&
            pagination &&
            !pagination.hasMore &&
            userData.length > 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  fontSize: "16px",
                  color: "#999",
                }}
              >
                모든 사진을 불러왔습니다.
              </div>
            )}
        </section>
      )}

      <PhotoDetail
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        userData={detailUserData}
      />
    </>
  );
}
