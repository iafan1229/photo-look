import React from "react";
import { Row, Col } from "react-bootstrap";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { ImagePreviewProps } from "@/type/preview";

const ImagePreview: React.FC<ImagePreviewProps> = ({ images }) => {
  if (images.length === 0) {
    return <p className='text-muted'>업로드된 이미지가 없습니다.</p>;
  }

  return (
    <Row className='image-preview-container'>
      {images.map(
        (image: { dataUrl: string | StaticImport }, index: number) => (
          <Col key={index}>
            <div className='image-wrap'>
              <Image
                src={image.dataUrl}
                alt={`Preview ${index + 1}`}
                className='img-preview'
                width={300}
                height={300}
              />
            </div>
          </Col>
        )
      )}
    </Row>
  );
};

export default ImagePreview;
