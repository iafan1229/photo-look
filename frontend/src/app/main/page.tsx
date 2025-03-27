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
import { visionAPI } from "@/apis/visionApi";
import {
  ImageData,
  ThemeType,
  StyleType,
  visionAnalyzedImage,
  geminiAnalyzedImage,
} from "@/type/preview";
import "bootstrap/dist/css/bootstrap.min.css";
import ImagePreview from "@/components/preview/ImagePreview";
import MagazinePreview from "@/components/preview/MagazinePreview";
import ModelSettings, {
  AIModelType,
} from "@/components/settings/ModelSettings";
import { generateGeminiApi } from "@/apis/geminiApi";
import InstagramVerification from "@/components/InstagramVerification";

const Main: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [analyzedImages, setAnalyzedImages] = useState<geminiAnalyzedImage[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [magazineTitle, setMagazineTitle] = useState<string>("");
  const [storyTheme, setStoryTheme] = useState<ThemeType>("auto");
  const [magazineStyle, setMagazineStyle] = useState<StyleType>("modern");
  const [showMagazine, setShowMagazine] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [generatingContent, setGeneratingContent] = useState<boolean>(false);
  const [progressMessage, setProgressMessage] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<AIModelType>("gemini");

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
    setGeneratingContent(true);
    setError("");
    setProgressMessage("이미지 분석 중...");

    try {
      // 각 이미지에 대해 Vision API 분석 수행
      const analysisPromises = images.map(async (img) => {
        const analysis = await visionAPI(img.dataUrl);
        return {
          dataUrl: img.dataUrl,
          name: img.name,
          analysis: analysis,
        };
      });

      const visionAnalyzedResults = await Promise.all(analysisPromises);
      console.log(visionAnalyzedResults);
      setProgressMessage("이미지 분석 완료. 스토리 구조 생성 중...");

      // 스토리 구조 생성
      const storyStructure = await generateStoryStructure(
        visionAnalyzedResults
      );

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
      setGeneratingContent(false);
      setProgressMessage("");
    }
  };

  // 스토리 구조 생성 및 텍스트 생성
  const generateStoryStructure = async (
    images: visionAnalyzedImage[]
  ): Promise<geminiAnalyzedImage[]> => {
    // 이미지 순서 정렬 (여기서는 간단히 구현)
    const sortedImages = [...images].sort(() => Math.random() - 0.5);

    // 각 이미지에 대해 선택된 AI 모델을 사용하여 텍스트 생성
    const imagesWithStory = await Promise.all(
      sortedImages.map(async (img, index) => {
        setProgressMessage(
          `텍스트 생성 중... (${index + 1}/${
            sortedImages.length
          }) - ${selectedModel} 모델 사용`
        );

        // 이미지 라벨 추출 (Vision API 분석 결과에서)
        const labels =
          img.analysis && img.analysis.labels
            ? img.analysis.labels.map((label) => label.description)
            : ["이미지"];

        // 테마 결정
        const theme =
          storyTheme === "auto"
            ? img.analysis &&
              img.analysis.labels &&
              img.analysis.labels.length > 0
              ? img.analysis.labels[0].description
              : "일상"
            : storyTheme;

        try {
          // 선택된 AI 모델로 텍스트 생성
          const storyText = await generateGeminiApi({
            imageLabels: labels,
            theme: theme,
            imageIndex: index,
            totalImages: sortedImages.length,
          });

          return {
            ...img,
            storyText: storyText,
          };
        } catch (error) {
          console.error("텍스트 생성 중 오류:", error);
          return {
            ...img,
            storyText: "이 이미지에 대한 이야기를 생성하지 못했습니다.",
          };
        }
      })
    );

    return imagesWithStory;
  };

  return (
    <Container className='py-5'>
      <h1 className='text-center mb-4'>사진 스토리텔링 매거진 생성기</h1>

      {error && <Alert variant='danger'>{error}</Alert>}
      {progressMessage && <Alert variant='info'>{progressMessage}</Alert>}

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
                    {generatingContent ? progressMessage : "분석 중..."}
                  </>
                ) : (
                  "사진 분석 및 매거진 생성"
                )}
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className='mb-4'>
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

          {/* AI 모델 선택 컴포넌트 추가 */}
          <ModelSettings
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
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
