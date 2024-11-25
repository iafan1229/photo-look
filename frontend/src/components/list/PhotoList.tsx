import Image from "next/image";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

export default function PhotoList() {
  return (
    <section>
      <div className='title'>
        <h1>Model Photos</h1>
      </div>
      <div className='list photos'>
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry>
            {[1, 2, 5, 3, 4, 1, 2, 3, 4, 5].map((el) => (
              <div className='photo'>
                <img src={`/img/${el}.jpg`} alt='' />
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </section>
  );
}
