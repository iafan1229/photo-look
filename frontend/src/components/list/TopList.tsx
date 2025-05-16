import { Button, Input, Select, Space } from "antd";
import Slider from "../Slider";
import { useState } from "react";

export default function TopList({
  filterValue,
  searchValue,
  setFilterValue,
  setSearchValue,
}: {
  filterValue: string | undefined;
  searchValue: string;
  setFilterValue: (value: string) => void;
  setSearchValue: (value: string) => void;
}) {
  const [filter, setFilter] = useState("total");
  const [value, setValue] = useState("");

  const options = [
    { label: "전체", value: "total" },
    {
      label: "이름",
      value: "name",
    },
    {
      label: "sns 아이디",
      value: "sns",
    },
    {
      label: "앨범 제목",
      value: "title",
    },
  ];
  const handleChange = (value: string) => {
    setFilter(value);
    setValue("");
  };

  const handleFilter = () => {
    setFilterValue(filter);
    setSearchValue(value);
    console.log(filter, value);
  };
  return (
    <>
      <section className='filter-section'>
        <div className='filter'>
          <div className='filter-select'>
            <Select
              className='select-filter'
              style={{ width: "100%" }}
              onChange={handleChange}
              defaultValue={"total"}
              options={options}
              optionRender={(option) => <Space>{option.data.label}</Space>}
            />
          </div>
          <div className='filter-input'>
            <Input
              value={value}
              disabled={filter === "total" ? true : false}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <div className='filter-button'>
            <Button type='primary' onClick={handleFilter}>
              검색
            </Button>
          </div>
        </div>
      </section>
      <section>
        <p className='main-description'>
          <strong>당신의 소중한 순간</strong>을{" "}
          <span className='highlight'>AI 스토리텔링</span>으로 더욱 특별하게
          만들어드립니다. 사진을 업로드하면 자동으로 분석하여{" "}
          <span className='highlight'>스토리가 있는 포토카드</span>로
          제작해드립니다.
        </p>
        <div>
          <Slider filterValue={filterValue} searchValue={searchValue} />
        </div>
      </section>
    </>
  );
}
