// src/components/settings/ModelSettings.tsx
import React from "react";
import { Form, Card } from "react-bootstrap";

export type AIModelType = "huggingface" | "gemini" | "ollama";

interface ModelSettingsProps {
  selectedModel: AIModelType;
  onModelChange: (model: AIModelType) => void;
}

const ModelSettings: React.FC<ModelSettingsProps> = ({
  selectedModel,
  onModelChange,
}) => {
  return (
    <Card>
      <Card.Header>AI 모델 설정</Card.Header>
      <Card.Body>
        <Form.Group className='mb-3'>
          <Form.Label>텍스트 생성에 사용할 AI 모델</Form.Label>
          <Form.Select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value as AIModelType)}
          >
            {/* <option value='huggingface'>Hugging Face (무료)</option> */}
            <option value='gemini'>Google Gemini (무료)</option>
            {/* <option value='ollama'>Ollama (로컬 실행, 무료)</option> */}
          </Form.Select>
          <Form.Text className='text-muted'>
            {/* {selectedModel === "huggingface" &&
              "Hugging Face API는 제한된 사용량 내에서 무료로 사용할 수 있습니다. API 키가 필요합니다."} */}
            {selectedModel === "gemini" &&
              "Google Gemini API는 무료 티어 내에서 사용할 수 있습니다. API 키가 필요합니다."}
            {/* {selectedModel === "ollama" &&
              "Ollama는 로컬에서 실행되는 무료 모델입니다. 별도 설치 및 실행이 필요합니다."} */}
          </Form.Text>
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default ModelSettings;
