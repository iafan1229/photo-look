import { Select, Space } from "antd";
import Slider from "../Slider";

export default function TopList() {
  const options = [
    {
      label: "최신등록 순",
      value: "china",
      emoji: "🇨🇳",
      desc: "China (中国)",
    },
    {
      label: "좋아요 합산순",
      value: "usa",
      emoji: "🇺🇸",
      desc: "USA (美国)",
    },
    {
      label: "팔로워 순",
      value: "japan",
      emoji: "🇯🇵",
      desc: "Japan (日本)",
    },
  ];
  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
  };
  return (
    <>
      <section className='filter-section'>
        <div className='filter'>
          <Select
            className='select-filter'
            mode='multiple'
            style={{ width: "100%" }}
            placeholder='select one country'
            defaultValue={["china"]}
            onChange={handleChange}
            options={options}
            optionRender={(option) => (
              <Space>
                <span role='img' aria-label={option.data.label}>
                  {option.data.emoji}
                </span>
                {option.data.desc}
              </Space>
            )}
          />
        </div>
      </section>
      <section>
        <p className='main-description'>
          <strong>당신의 소중한 순간</strong>을{" "}
          <span className='highlight'>AI 스토리텔링</span>으로 더욱 특별하게
          만들어드립니다. 사진을 업로드하면 자동으로 분석하여{" "}
          <span className='highlight'>스토리가 있는 앨범</span>으로
          제작해드립니다.
        </p>
        <div>
          <Slider />
        </div>
      </section>
    </>
  );
}
