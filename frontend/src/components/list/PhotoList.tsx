import Image from "next/image";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "@/type";

export default function PhotoList() {
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listResponse] = await Promise.all([
          axios.get("/api/main/list"),
          // axios.get("/api/main/list-slider"),
        ]);

        console.log("List Data:", listResponse);
        setUserData(listResponse.data.data);
        // console.log("Detail Data:", detailResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {userData?.length && (
        <section>
          <div className='title'>
            <h1>Model Photos</h1>
          </div>
          <div className='list photos'>
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 300: 2, 500: 3, 700: 4 }}
            >
              <Masonry gutter='20px'>
                {userData.map((el: User) => (
                  <>
                    <div className='photo'>
                      <Image src={el?.upload?.[0]} fill alt='' />
                    </div>
                  </>
                ))}
              </Masonry>
            </ResponsiveMasonry>
          </div>
        </section>
      )}
    </>
  );
}
