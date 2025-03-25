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
      // 실제 구현에서는 Google Cloud Vision API를 호출해야 합니다.
      // 여기서는 시뮬레이션으로 구현합니다.
      const results = await simulateVisionAPIAnalysis(images);
      setAnalyzedImages(results);
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

  // Vision API 분석 시뮬레이션 함수
  const simulateVisionAPIAnalysis = (
    images: ImageData[]
  ): Promise<AnalyzedImage[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const themes = ["여행", "가족", "음식", "자연", "도시", "이벤트"];
        const emotions = ["기쁨", "평온", "놀라움", "감동"];
        const colors = [
          "#3498db",
          "#2ecc71",
          "#e74c3c",
          "#f39c12",
          "#9b59b6",
          "#1abc9c",
        ];

        const analyzedImages = images.map((img) => {
          const randomLabels = [];
          const numLabels = Math.floor(Math.random() * 5) + 2;

          for (let i = 0; i < numLabels; i++) {
            randomLabels.push({
              description: `태그 ${i + 1}`,
              score: Math.random(),
            });
          }

          return {
            dataUrl: img.dataUrl,
            name: img.name,
            analysis: {
              labels: randomLabels,
              mainTheme: themes[Math.floor(Math.random() * themes.length)],
              emotion: emotions[Math.floor(Math.random() * emotions.length)],
              dominantColors: [
                colors[Math.floor(Math.random() * colors.length)],
                colors[Math.floor(Math.random() * colors.length)],
              ],
              landmark: Math.random() > 0.8 ? "에펠탑" : null,
              text: Math.random() > 0.7 ? "이미지에서 추출된 텍스트" : "",
              faces: Math.random() > 0.5 ? [{ joy: Math.random() > 0.5 }] : [],
            },
          };
        });

        // 스토리 흐름을 생성하기 위해 이미지 순서 재조정
        const storyStructure = generateStoryStructure(analyzedImages);
        resolve(storyStructure);
      }, 2000); // 2초 지연으로 API 호출 시뮬레이션
    });
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
