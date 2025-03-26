from flask import Blueprint, request, jsonify
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import time
from driver import start_driver, stop_driver

verify_comment = Blueprint('verify_comment', __name__)

@verify_comment.route('/api/verify-comment', methods=['POST'])
def verify_instagram_comment():
    """
    인스타그램 게시물에 특정 사용자가 특정 코드를 댓글로 남겼는지 확인하는 API
    
    요청 데이터:
    - postUrl: 확인할 인스타그램 게시물 URL
    - instagramId: 확인할 사용자의 인스타그램 ID
    - verificationCode: 확인할 인증 코드
    
    응답:
    - status: 'success' 또는 'fail'
    - verified: True 또는 False (댓글 확인 결과)
    - message: 상세 메시지
    """
    driver = start_driver()
    data = request.json
    
    if not data:
        return jsonify({'status': 'fail', 'message': 'No input received'}), 400
    
    post_url = data.get('postUrl')
    instagram_id = data.get('instagramId')
    verification_code = data.get('verificationCode')
    
    if not post_url or not instagram_id or not verification_code:
        return jsonify({
            'status': 'fail', 
            'message': 'Missing required parameters (postUrl, instagramId, or verificationCode)'
        }), 400
    
    try:
        # 게시물 페이지로 이동
        driver.get(post_url)
        time.sleep(5)  # 페이지 로딩 대기
        
        # "댓글 더 불러오기" 버튼이 있으면 모든 댓글을 로드
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
        
        # 페이지 소스에서 댓글 추출
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        
        # 댓글 컨테이너 찾기 (CSS 선택자는 인스타그램 구조에 맞게 업데이트 필요)
        comments_container = soup.select('ul._a9ym')
        
        if not comments_container:
            return jsonify({
                'status': 'fail',
                'verified': False,
                'message': '댓글을 찾을 수 없습니다.'
            }), 404
        
        # 각 댓글 항목에서 사용자명과 댓글 내용 확인
        comments = []
        for container in comments_container:
            comment_items = container.select('div._a9zr')
            
            for item in comment_items:
                try:
                    # 사용자명 추출
                    username_element = item.select_one('h3._a9zc')
                    if username_element:
                        username = username_element.text.strip()
                    else:
                        continue
                    
                    # 댓글 내용 추출
                    comment_element = item.select_one('div._a9zs span')
                    if comment_element:
                        comment_text = comment_element.text.strip()
                    else:
                        continue
                    
                    comments.append({
                        'username': username,
                        'text': comment_text
                    })
                except Exception as e:
                    print(f"댓글 파싱 중 오류: {str(e)}")
        
        # 일치하는 댓글 찾기
        found_comment = False
        for comment in comments:
            if (comment['username'] == instagram_id and 
                verification_code in comment['text']):
                found_comment = True
                break
        
        if found_comment:
            return jsonify({
                'status': 'success',
                'verified': True,
                'message': '인증 코드가 포함된 댓글을 찾았습니다.'
            }), 200
        else:
            # 사용자의 댓글은 있지만 인증 코드가 없는 경우
            user_comments = [c for c in comments if c['username'] == instagram_id]
            if user_comments:
                return jsonify({
                    'status': 'fail',
                    'verified': False,
                    'message': f'{instagram_id} 계정의 댓글에서 인증 코드를 찾을 수 없습니다.'
                }), 404
            else:
                return jsonify({
                    'status': 'fail',
                    'verified': False,
                    'message': f'{instagram_id} 계정으로 작성된 댓글을 찾을 수 없습니다.'
                }), 404
    
    except Exception as e:
        return jsonify({
            'status': 'fail',
            'verified': False,
            'message': '댓글 확인 중 오류가 발생했습니다.',
            'error': str(e)
        }), 500
    
    finally:
        # 드라이버 종료
        stop_driver()