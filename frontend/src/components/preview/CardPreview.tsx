import React from "react";
import { Row, Col } from "react-bootstrap";
import Image from "next/image";
import { PhotoCardPreviewProps } from "@/type/preview";

const CardPreview: React.FC<PhotoCardPreviewProps> = ({ images }) => {
  if (images.length === 0) {
    return <p className='text-muted'>업로드된 이미지가 없습니다.</p>;
  }

  return (
    <Row className='image-preview-container'>
      {images.map((image: { dataUrl: string | undefined }, index: number) => (
        <div key={index}>
          <div className='image-wrap'>
            <img
              src={image.dataUrl}
              alt={`Preview ${index + 1}`}
              className='img-preview'
              width={300}
              height={300}
            />
          </div>
        </div>
      ))}
    </Row>
  );
};

export default CardPreview;
