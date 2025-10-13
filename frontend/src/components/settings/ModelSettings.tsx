import React from "react";
import { Form, Card } from "react-bootstrap";

export type AIModelType = "gemini";

interface ModelInfo {
  value: AIModelType;
  label: string;
  description: string;
  isEnabled: boolean;
}

interface ModelSettingsProps {
  selectedModel: AIModelType;
  onModelChange: (model: AIModelType) => void;
  title?: string;
  className?: string;
}

const availableModels: ModelInfo[] = [
  {
    value: "gemini",
    label: "Google Gemini (무료)",
    description: "Google Gemini API는 무료 티어 내에서 사용할 수 있습니다. API 키가 필요합니다.",
    isEnabled: true,
  },
];

const ModelSettings: React.FC<ModelSettingsProps> = ({
  selectedModel,
  onModelChange,
  title = "AI 모델 설정",
  className,
}) => {
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as AIModelType;
    onModelChange(value);
  };

  const selectedModelInfo = availableModels.find(
    (model) => model.value === selectedModel
  );

  return (
    <Card className={className}>
      <Card.Header>{title}</Card.Header>
      <Card.Body>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="ai-model-select">
            텍스트 생성에 사용할 AI 모델
          </Form.Label>
          <Form.Select
            id="ai-model-select"
            value={selectedModel}
            onChange={handleModelChange}
            aria-describedby="ai-model-description"
          >
            {availableModels
              .filter((model) => model.isEnabled)
              .map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
          </Form.Select>
          {selectedModelInfo && (
            <Form.Text id="ai-model-description" className="text-muted">
              {selectedModelInfo.description}
            </Form.Text>
          )}
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default ModelSettings;
