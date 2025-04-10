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
        url = request.args.get('url', 'https://www.instagram.com/p/DHp8515SJec')
        instagram_id = request.args.get('verification_code', '')  # 프론트엔드에서 보낸 Instagram ID
        
        if not instagram_id:
            return jsonify({
                'status': 'fail',
                'message': 'Instagram ID가 제공되지 않았습니다.'
            }), 400

        driver.get(url)
        time.sleep(3)  # 페이지 로딩 대기
        
        # 팝업창 닫기 (aria-label 속성 사용)
        # try:
        #     close_button = WebDriverWait(driver, 10).until(
        #         EC.element_to_be_clickable((By.XPATH, "//div[./svg[@aria-label='닫기']]"))
        #     )
        #     actions = ActionChains(driver)
        #     actions.move_to_element(close_button).click().perform()
        #     time.sleep(2)
        # except Exception as e:
        #     print(f"팝업창 닫기 실패: {str(e)}")

        # 댓글 더 보기 버튼 클릭 (role 속성 사용)
        try:
            while True:
                try:
                    load_more_button = WebDriverWait(driver, 5).until(
                        EC.element_to_be_clickable((By.XPATH, "//button[@type='button' and contains(., '답글 더보기')]"))
                    )
                    driver.execute_script("arguments[0].click();", load_more_button)
                    time.sleep(2)
                except:
                    break
        except Exception as e:
            print(f"댓글 더 불러오기 중 오류 발생: {str(e)}")

        # 페이지 소스에서 댓글 추출
        page_source = driver.page_source
        soup = BeautifulSoup(page_source, 'html.parser')
        
        # 댓글 컨테이너 찾기 (article 내부의 ul 요소)
        comments_container = soup.select('main article ul._a9z6._a9za')
        
        if not comments_container:
            return jsonify({
                'status': 'fail',
                'message': '댓글을 찾을 수 없습니다.'
            }), 404
        
        # 각 댓글 항목에서 사용자명 확인 (role 속성 사용)
        for container in comments_container:
            comment_items = container.select('div[role="button"]')
            
            for item in comment_items:
                try:
                    # 사용자명 추출 
                    username_element = item.select_one('h3')
                    if username_element:
                        comment_username = username_element.text.strip()
                        # Instagram ID가 일치하는지 확인
                        if comment_username == instagram_id:
                            return jsonify({
                                'status': 'success',
                                'userId': comment_username,
                                'message': '해당 사용자의 댓글을 찾았습니다.'
                            }), 200
                except Exception as e:
                    print(f"댓글 파싱 중 오류: {str(e)}")
        
        # 일치하는 댓글을 찾지 못한 경우
        return jsonify({
            'status': 'fail',
            'message': f'Instagram ID "{instagram_id}"의 댓글을 찾을 수 없습니다.'
        }), 404
                
    except Exception as e:
        return jsonify({
            'status': 'fail',
            'message': '댓글 확인 중 오류가 발생했습니다.',
            'error': str(e)
        }), 500
    
    finally:
        # 드라이버 종료
        stop_driver()