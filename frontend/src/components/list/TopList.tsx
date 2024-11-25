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
      <section>
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
        <div className='title'>
          <h1>TOP 10!</h1>
          <p>팔로워 기준으로 필터링된 결과입니다</p>
        </div>
        <div>
          <Slider />
        </div>
      </section>
    </>
  );
}
