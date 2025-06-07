"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Row, Col, Card, Timeline, Divider } from "antd";
import {
  PictureOutlined,
  HeartOutlined,
  RocketOutlined,
  LockOutlined,
} from "@ant-design/icons";

const AboutPage = () => {
  return (
    <div className='about-page'>
      {/* 소개 섹션 */}
      <section className='intro-section'>
        <div className='container'>
          <Row gutter={[40, 40]} align='middle'>
            <Col xs={24} md={12}>
              <h1 className='page-title'>서비스 소개</h1>
              <h2 className='intro-subtitle'>사진 기반 AI 스토리텔링 서비스</h2>
              <p className='intro-text'>
                Photo Look은 사용자가 업로드한 사진들을 인공지능으로 분석하여
                스토리텔링이 있는 디지털 포토카드로 자동 변환해주는
                서비스입니다. 소중한 추억을 단순한 사진 모음이 아닌, 감성적인
                이야기가 담긴 포토카드로 만들어 보세요.
              </p>
              <Link href='/register'>
                <Button
                  type='primary'
                  size='large'
                  icon={<PictureOutlined />}
                  className='cta-button'
                >
                  지금 시작하기
                </Button>
              </Link>
            </Col>
            <Col xs={24} md={12} className='intro-image'>
              <div className='image-stack'>
                <div className='image-stack__item image-stack__item--top'>
                  <Image
                    src='/img/album1.jpg'
                    alt='포토카드 이미지'
                    width={350}
                    height={250}
                    className='rounded-image'
                  />
                </div>
                <div className='image-stack__item image-stack__item--bottom'>
                  <Image
                    src='/img/album2.jpg'
                    alt='포토카드 이미지'
                    width={350}
                    height={250}
                    className='rounded-image'
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* 핵심 가치 섹션 */}
      <section className='values-section'>
        <div className='container'>
          <h2 className='section-title'>사용 가이드</h2>
          <p style={{ textAlign: "center", paddingBottom: 10 }}>
            클릭시에 가이드 예시 이미지가 뜹니다.
          </p>
          <Row gutter={[20, 0]}>
            <Col xs={24} sm={24} md={8} lg={8} className='card-guide'>
              <Card className='value-card' style={{ padding: 0 }}>
                <div className='card-img'>
                  <Link href='/img/guide-1.png' target='_blank'>
                    <img src='/img/guide-1.png' alt='' />
                  </Link>
                </div>
                <div className='card-content'>
                  <h4>이미지를 업로드하세요.</h4>
                  <p>
                    단순한 사진이 아닌, 이야기와 감정이 담긴
                    <br /> 포토카드 및 앨범을 만들어냅니다.
                  </p>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} className='card-guide'>
              <Card className='value-card' style={{ padding: 0 }}>
                <div className='card-img'>
                  <Link href='/img/guide-2.png' target='_blank'>
                    <img src='/img/guide-2.png' alt='' />
                  </Link>
                </div>
                <div className='card-congtent'>
                  <h4>포토 앨범을 등록 신청하세요.</h4>
                  <p>
                    신청한 포토 카드를 관리자의 검수를 거쳐 <br /> Photo-look
                    사이트에 등록합니다.
                  </p>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} className='card-guide'>
              <Card className='value-card' style={{ padding: 0 }}>
                <div className='card-img'>
                  <Link href='/img/guide-3.png' target='_blank'>
                    <img src='/img/guide-3.png' alt='' />
                  </Link>
                </div>
                <div className='card-content'>
                  <h4>사이트에서 앨범을 확인해 보세요</h4>
                  <p>
                    의미 있는 추억을 사이트 위에서 확인하고
                    <br />
                    사용자와 경험을 공유해보세요
                  </p>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* 팀 소개 섹션 */}
      <section className='team-section'>
        <div className='container'>
          <h2 className='section-title'>Creator</h2>
          <Row style={{ justifyContent: "center" }}>
            <Col>
              <div className='team-member'>
                <div className='member-photo'>
                  <Image
                    src='/img/creator.png'
                    alt='팀원 사진'
                    width={200}
                    height={200}
                  />
                </div>
                <h3>이하영</h3>
                <p className='member-role'>Web Developer</p>
                <p className='member-bio'>
                  포토 카드를 생성하는 Photo Look 프로젝트의 <br />
                  기획 / 디자인 그리고 풀스택 개발을 진행했습니다.
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className='cta-section'>
        <div className='container'>
          <h2>당신의 이야기를 시작해보세요</h2>
          <p>소중한 추억을 AI 스토리텔링으로 더 특별하게 만들어보세요.</p>
          <div className='cta-buttons'>
            <Link href='/register'>
              <Button type='primary' size='large'>
                포토카드 만들기
              </Button>
            </Link>
            <Link href='/photo'>
              <Button size='large'>다른 포토카드 둘러보기</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
