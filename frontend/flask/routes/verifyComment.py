from flask import Blueprint, request, jsonify
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from bs4 import BeautifulSoup
import time
from driver import start_driver, stop_driver

verify_comment = Blueprint('verify_comment', __name__)

@verify_comment.route('/api/verify-comment', methods=['GET'])
def verify_instagram_comment():
    """
    인스타그램 게시물의 모든 댓글을 확인하고 특정 조건에 맞는 사용자 아이디를 반환하는 API
    
    단계:
    
    1. https://www.instagram.com/p/DHp8515SJec 에 접근
    2. 팝업창 닫기
    4. 해당 URL의 모든 댓글을 HTML로 추출
    5. 추출한 댓글 중 사용자명과 댓글 내용을 확인
    6. 댓글을 찾음
    7. 댓글이 일치할 경우 해당 사용자 아이디를 리턴
    """
    driver = start_driver()
    
    try:
            try:
                url = request.args.get('url', 'https://www.instagram.com/p/DHp8515SJec')
                driver.get(url)
                time.sleep(3)  # 페이지 로딩 대기
                
                # # 방법 1: aria-label 속성으로 찾기
                # close_button = WebDriverWait(driver, 10).until(
                #     EC.element_to_be_clickable((By.XPATH, "//svg[@aria-label='닫기']"))
                # )
                
                # # 방법 2: 아이콘의 클래스로 찾기
                # # close_button = WebDriverWait(driver, 10).until(
                # #     EC.element_to_be_clickable((By.CSS_SELECTOR, "svg.x1lliihq.x1n2onr6.x1roi4f4"))
                # # )
                
                # # 방법 3: 부모 div까지 포함하여 찾기
                close_button = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, "//div[./svg[@aria-label='닫기']]"))
                )
                
                # 클릭 실행
                close_button.click()
                time.sleep(3)  # 페이지 로딩 대기
            except Exception as e:
                print(f"사진첩 이동 중 오류: {str(e)}")
          
       
        
            # 4. "댓글 더 불러오기" 버튼이 있으면 모든 댓글을 로드
            try:
                load_more_comments_selector = "._aao9 ._ab8w button"
                while True:
                    try:
                        load_more_button = WebDriverWait(driver, 5).until(
                            EC.element_to_be_clickable((By.CSS_SELECTOR, load_more_comments_selector))
                        )
                        driver.execute_script("arguments[0].click();", load_more_button)
                        time.sleep(2)
                    except:
                        # 더 이상 "댓글 더 불러오기" 버튼이 없으면 루프 종료
                        break
            except Exception as e:
                # 댓글 더 불러오기 버튼이 없거나 오류 발생 시 무시하고 진행
                print(f"댓글 더 불러오기 중 오류 발생: {str(e)}")
        
            # 5. 페이지 소스에서 댓글 추출
            page_source = driver.page_source
            soup = BeautifulSoup(page_source, 'html.parser')
            
            # 댓글 컨테이너 찾기
            comments_container = soup.select('ul._a9ym')
            
            if not comments_container:
                return jsonify({
                    'status': 'fail',
                    'message': '댓글을 찾을 수 없습니다.'
                }), 404
            
            # 6. 각 댓글 항목에서 사용자명과 댓글 내용 확인
            comments = []
            
            for container in comments_container:
                comment_items = container.select('div._a9zr')
                
                for item in comment_items:
                    try:
                        # 사용자명 추출
                        username_element = item.select_one('h3._a9zc')
                        if username_element:
                            comment_username = username_element.text.strip()
                        else:
                            continue
                        
                        # 댓글 내용 추출
                        comment_element = item.select_one('div._a9zs span')
                        if comment_element:
                            comment_text = comment_element.text.strip()
                        else:
                            continue
                        
                        comments.append({
                            'username': comment_username,
                            'text': comment_text
                        })
                            
                    except Exception as e:
                        print(f"댓글 파싱 중 오류: {str(e)}")
            
            # 7. 댓글 검증 및 사용자 아이디 반환
            # 클라이언트로부터 받은 검증 코드나 조건으로 댓글 확인
            # 아래 코드는 request.args로부터 verification_code를 받아 사용하는 예시입니다.
            verification_code = request.args.get('verification_code', '')
            
            if verification_code:
                for comment in comments:
                    if verification_code in comment['text']:
                        return jsonify({
                            'status': 'success',
                            'userId': comment['username'],
                            'message': '검증 코드가 포함된 댓글을 찾았습니다.'
                        }), 200
                
                return jsonify({
                    'status': 'fail',
                    'message': f'검증 코드 "{verification_code}"가 포함된 댓글을 찾을 수 없습니다.'
                }), 404
            else:
                # 검증 코드가 제공되지 않은 경우 모든 댓글 반환
                return jsonify({
                    'status': 'success',
                    'comments': comments,
                    'message': '모든 댓글을 추출했습니다.'
                }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'fail',
            'message': '댓글 확인 중 오류가 발생했습니다.',
            'error': str(e)
        }), 500
    
    finally:
        # 드라이버 종료
        stop_driver()