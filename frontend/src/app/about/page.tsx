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
          <h2 className='section-title'>핵심 가치</h2>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={8}>
              <Card className='value-card'>
                <div className='value-icon'>
                  <HeartOutlined />
                </div>
                <h3>감성을 담습니다</h3>
                <p>
                  단순한 사진이 아닌, 이야기와 감정이 담긴 포토카드를 만듭니다.
                </p>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card className='value-card'>
                <div className='value-icon'>
                  <RocketOutlined />
                </div>
                <h3>혁신을 추구합니다</h3>
                <p>
                  최신 AI 기술을 활용하여 사용자 경험을 개선합니다. 디지털
                  시대의 새로운 추억 보관 방식을 제시합니다.
                </p>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card className='value-card'>
                <div className='value-icon'>
                  <LockOutlined />
                </div>
                <h3>편리함의 최적화</h3>
                <p>
                  추억을 쉽고 빠르게 저장할 수 있도록 돕습니다. 의미 있는 추억을
                  온라인으로 더 오래 간직할 수 있도록 돕습니다.
                </p>
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
                  Photo Look 프로젝트에서 기획 / 디자인 <br />
                  그리고 풀스택 개발을 진행했습니다.
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
