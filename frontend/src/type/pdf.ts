// PDF용 인라인 스타일 적용 (SCSS 문제 해결)
export const applyPDFStyles = (element: HTMLElement): void => {
  // 기존 스타일 백업
  element.setAttribute(
    "data-original-style",
    element.getAttribute("style") || ""
  );

  // A4 캔버스 사이즈 계산
  const A4_WIDTH_PX = 794; // A4 너비
  const POLAROID_GAP = 20; // polaroid 간격
  const CONTAINER_PADDING = 60; // 컨테이너 패딩
  const AVAILABLE_WIDTH = A4_WIDTH_PX - CONTAINER_PADDING * 2;

  // 한 줄에 들어갈 polaroid 개수 계산 (최소 너비 200px 기준)
  const POLAROID_MIN_WIDTH = 200;
  const POLAROIDS_PER_ROW = Math.floor(
    (AVAILABLE_WIDTH + POLAROID_GAP) / (POLAROID_MIN_WIDTH + POLAROID_GAP)
  );
  const POLAROID_WIDTH = Math.floor(
    (AVAILABLE_WIDTH - POLAROID_GAP * (POLAROIDS_PER_ROW - 1)) /
      POLAROIDS_PER_ROW
  );

  // .album-container 스타일 적용 - 원래 배경색 유지
  const albumContainer = element.querySelector(
    ".album-container"
  ) as HTMLElement;
  if (albumContainer) {
    albumContainer.style.cssText = `
          font-family: "Ownglyph_corncorn-Rg", Arial, sans-serif;
          max-height: none;
          overflow-y: visible;
          background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
          padding: 30px;
          margin: 0;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: none;
          position: relative;
        `;
  }

  // .album-cover 스타일 적용
  const albumCover = element.querySelector(".album-cover") as HTMLElement;
  if (albumCover) {
    albumCover.style.cssText = `
          padding: 20px;
          border-radius: 5px;
          margin-bottom: 30px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          position: relative;
          background-color: white;
        `;
  }

  // .polaroid 스타일 적용 - A4 캔버스에 맞게 크기 조정
  const polaroids = element.querySelectorAll(".polaroid");
  polaroids.forEach((polaroid: Element) => {
    (polaroid as HTMLElement).style.cssText = `
          background-color: white;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
          max-width: ${POLAROID_WIDTH}px;
          min-width: ${POLAROID_WIDTH}px;
          width: ${POLAROID_WIDTH}px;
          display: flex;
          flex-direction: column;
          position: relative;
          margin-bottom: 20px;
          flex-shrink: 0;
         
        `;
  });

  // .album-pages 스타일 적용 - A4 너비에 맞게 정렬
  const albumPages = element.querySelector(".album-pages") as HTMLElement;
  if (albumPages) {
    albumPages.style.cssText = `
          page-break-inside: avoid;
          display: flex;
          flex-wrap: wrap;
          gap: ${POLAROID_GAP}px;
          justify-content: flex-start;
          padding: 10px;
          width: 100%;
          max-width: ${A4_WIDTH_PX}px;
          margin: 0 auto;
        `;
  }

  // 이미지 스타일 적용 - 깨짐 방지
  const images = element.querySelectorAll("img");
  images.forEach((img: Element) => {
    const imgElement = img as HTMLImageElement;
    imgElement.style.cssText = `
          width: 100%;
          height: auto;
          max-height: ${Math.floor(POLAROID_WIDTH * 0.7)}px;
          display: block;
          object-fit: cover;
          border-radius: 5px;
        `;

    // 이미지 로딩 보장
    if (!imgElement.complete) {
      imgElement.onload = () => {
        console.log("Image loaded:", imgElement.src);
      };
    }
  });

  // .photo-description 스타일 적용
  const descriptions = element.querySelectorAll(".photo-description");
  descriptions.forEach((desc: Element) => {
    (desc as HTMLElement).style.cssText = `
          background-color: #fbfcdb;
          padding: 8px 12px;
          font-size: 11px;
          box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 5px;
          font-family: "Ownglyph_corncorn-Rg", Arial, sans-serif;
          line-height: 1.4;
          border-radius: 3px;
          margin-top: 8px;
        `;
  });

  // .photo-container 높이 조정 (polaroid 크기에 맞게)
  const photoContainers = element.querySelectorAll(".photo-container");
  photoContainers.forEach((container: Element) => {
    (container as HTMLElement).style.cssText = `
          padding-top: 5px;
          margin-bottom: 8px;
          height: ${Math.floor(POLAROID_WIDTH * 0.7)}px;
          overflow: hidden;
          position: relative;
          border-radius: 5px;
          background-color: #f5f5f5;
        `;
  });

  // .photo-title 스타일 적용
  const photoTitles = element.querySelectorAll(".photo-title");
  photoTitles.forEach((title: Element) => {
    (title as HTMLElement).style.cssText = `
          font-size: 14px;
          font-family: "CookieRun-Regular", Arial, sans-serif;
          line-height: 1.3;
          padding-bottom: 5px;
          font-weight: bold;
          color: #333;
        `;
  });
};

// PDF용 스타일 제거 (원복)
export const removePDFStyles = (element: HTMLElement): void => {
  const originalStyle = element.getAttribute("data-original-style");
  if (originalStyle) {
    element.setAttribute("style", originalStyle);
  } else {
    element.removeAttribute("style");
  }
  element.removeAttribute("data-original-style");

  // 모든 하위 요소의 인라인 스타일 제거
  const allElements = element.querySelectorAll("*");
  allElements.forEach((el: Element) => {
    if (el.hasAttribute("data-pdf-styled")) {
      (el as HTMLElement).removeAttribute("style");
      el.removeAttribute("data-pdf-styled");
    }
  });
};
