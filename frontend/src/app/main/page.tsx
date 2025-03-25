"use client";
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { analyzeImage } from "@/apis/visionApi";
import { ImageData, AnalyzedImage, ThemeType, StyleType } from "@/type/preview";
import "bootstrap/dist/css/bootstrap.min.css";
import ImagePreview from "@/components/preview/ImagePreview";
import MagazinePreview from "@/components/preview/MagazinePreview";

const Main: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [analyzedImages, setAnalyzedImages] = useState<AnalyzedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [magazineTitle, setMagazineTitle] = useState<string>("");
  const [storyTheme, setStoryTheme] = useState<ThemeType>("auto");
  const [magazineStyle, setMagazineStyle] = useState<StyleType>("modern");
  const [showMagazine, setShowMagazine] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const fileList = Array.from(e.target.files);

    const imagePromises = fileList.map((file) => {
      return new Promise<ImageData>((resolve, reject) => {
        if (!file.type.match("image.*")) {
          reject(new Error(`${file.name}은(는) 이미지 파일이 아닙니다.`));
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            resolve({
              file: file,
              dataUrl: e.target.result as string,
              name: file.name,
            });
          } else {
            reject(
              new Error(`${file.name} 파일을 읽는 중 오류가 발생했습니다.`)
            );
          }
        };
        reader.onerror = () =>
          reject(new Error(`${file.name} 파일을 읽는 중 오류가 발생했습니다.`));
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises)
      .then((loadedImages) => {
        setImages(loadedImages);
        setError("");
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const analyzePictures = async () => {
    if (images.length === 0) {
      setError("최소 한 장 이상의 사진을 업로드해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 각 이미지에 대해 Vision API 분석 수행
      const analysisPromises = images.map(async (img) => {
        const analysis = await analyzeImage(img.dataUrl);
        return {
          dataUrl: img.dataUrl,
          name: img.name,
          analysis: analysis,
        };
      });

      const analyzedResults = await Promise.all(analysisPromises);

      // 스토리 구조 생성
      const storyStructure = generateStoryStructure(analyzedResults);

      setAnalyzedImages(storyStructure);
      setShowMagazine(true);
    } catch (err) {
      if (err instanceof Error) {
        setError("이미지 분석 중 오류가 발생했습니다: " + err.message);
      } else {
        setError("이미지 분석 중 알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 스토리 구조 생성
  const generateStoryStructure = (images: AnalyzedImage[]): AnalyzedImage[] => {
    // 여기서는 간단히 구현. 실제로는 이미지 분석 결과를 바탕으로 스토리라인에 맞게 배치
    return [...images].sort(() => Math.random() - 0.5);
  };

  return (
    <Container className='py-5'>
      <h1 className='text-center mb-4'>사진 스토리텔링 매거진 생성기</h1>

      {error && <Alert variant='danger'>{error}</Alert>}

      <Row className='mb-4'>
        <Col md={6}>
          <Card>
            <Card.Header>사진 업로드</Card.Header>
            <Card.Body>
              <Form.Group controlId='formFileMultiple' className='mb-3'>
                <Form.Label>여러 장의 사진을 선택하세요</Form.Label>
                <Form.Control
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={handleFileChange}
                />
              </Form.Group>

              <ImagePreview images={images} />

              <Button
                variant='primary'
                onClick={analyzePictures}
                disabled={loading || images.length === 0}
                className='mt-3'
              >
                {loading ? (
                  <>
                    <Spinner
                      as='span'
                      animation='border'
                      size='sm'
                      role='status'
                      aria-hidden='true'
                      className='me-2'
                    />
                    분석 중...
                  </>
                ) : (
                  "사진 분석 및 매거진 생성"
                )}
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>테마 설정</Card.Header>
            <Card.Body>
              <Form.Group className='mb-3'>
                <Form.Label>매거진 제목</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='매거진 제목을 입력하세요'
                  value={magazineTitle}
                  onChange={(e) => setMagazineTitle(e.target.value)}
                />
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Label>스토리 테마</Form.Label>
                <Form.Select
                  value={storyTheme}
                  onChange={(e) => setStoryTheme(e.target.value as ThemeType)}
                >
                  <option value='auto'>자동 감지 (Vision API 기반)</option>
                  <option value='travel'>여행</option>
                  <option value='family'>가족</option>
                  <option value='food'>음식</option>
                  <option value='nature'>자연</option>
                  <option value='city'>도시</option>
                  <option value='event'>이벤트</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Label>매거진 스타일</Form.Label>
                <Form.Select
                  value={magazineStyle}
                  onChange={(e) =>
                    setMagazineStyle(e.target.value as StyleType)
                  }
                >
                  <option value='modern'>모던</option>
                  <option value='classic'>클래식</option>
                  <option value='minimalist'>미니멀리스트</option>
                  <option value='vibrant'>비비드</option>
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {showMagazine && (
        <MagazinePreview
          title={magazineTitle || "나의 스토리"}
          images={analyzedImages}
          theme={storyTheme}
          style={magazineStyle}
        />
      )}
    </Container>
  );
};

export default Main;
