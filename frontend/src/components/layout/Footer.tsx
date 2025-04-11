"use client";

import Link from "next/link";
import Image from "next/image";
import { Row, Col, Input, Button } from "antd";

const Footer = () => {
  return (
    <footer className='site-footer'>
      <div className='footer-container'>
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={24} md={8} lg={8}>
            <div className='footer-section'>
              <div className='footer-logo'>
                <Image
                  src='/img/photo-look-logo-dark-bg.svg'
                  alt='Photo Look 로고'
                  width={150}
                  height={40}
                />
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} md={8} lg={8}>
            <div></div>
            <div className='footer-section'>
              <ul className='footer-links'>
                <li>
                  <Link href='/'>홈</Link>
                </li>
                <li>
                  <Link href='/register'>앨범 만들기</Link>
                </li>
                <li>
                  <Link href='/photo'>앨범 구경하기</Link>
                </li>
                {/* <li>
                  <Link href='/guide'>이용 가이드</Link>
                </li> */}
                <li>
                  <Link href='/about'>서비스 소개</Link>
                </li>
                {/* <li>
                  <Link href='/faq'>자주 묻는 질문</Link>
                </li> */}
              </ul>
            </div>
          </Col>

          <div className='footer-bottom'>
            <div className='copyright'>
              &copy; {new Date().getFullYear()} Photo Look. All rights reserved.
            </div>
            {/* <div className='footer-bottom-links'>
            <Link href='/terms'>이용약관</Link>
            <Link href='/privacy'>개인정보처리방침</Link>
          </div> */}
          </div>
        </Row>
      </div>
    </footer>
  );
};

export default Footer;
