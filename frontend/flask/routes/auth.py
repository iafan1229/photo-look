import time
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from flask import Blueprint, request, jsonify
from selenium.webdriver.common.action_chains import ActionChains
from driver import start_driver, stop_driver
from selenium.webdriver.common.action_chains import ActionChains


auth = Blueprint('auth', __name__)


@auth.route('/api/login', methods=['POST'])
def logn():
    driver = start_driver()
    data = request.json 
    print("Input received:", data)
    if data:
        username = data.get('userName')  
        password = data.get('password') 

        # Instagram 로그인 호출
        response = instagramLogin(username, password, driver)
        return response

    return jsonify({'status': 'fail', 'message': 'No input received'}), 400

def instagramLogin(username, password, driver):
    driver.get("https://instagram.com")

    try:
        id_box = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "#loginForm > div > div:nth-child(1) > div > label > input"))
        )
     
        password_box = driver.find_element(By.CSS_SELECTOR, "#loginForm > div > div:nth-child(2) > div > label > input")
        login_button = driver.find_element(By.XPATH, "//div[contains(text(), '로그인')]")

   
        act = ActionChains(driver)
        act.send_keys_to_element(id_box, username)\
            .send_keys_to_element(password_box, password)\
            .click(login_button)\
            .perform()

        print("로그인 성공! 내비게이션 바가 로드되었습니다.")
        
    
        loadUserPage(driver, username)
        
        return jsonify({'status': 'success', 'userId': username}), 200

    except Exception as e:
        stop_driver()
        return jsonify({'status': 'fail', 'message': 'Login failed', 'error': str(e)}), 500
    
def loadUserPage(driver, username):
    try:
        # driver.get(f"https://instagram.com/{username}")
        url = f'/{username}/?next=%2F'
        # 사진첩으로 이동 버튼 찾기 (동적으로 로드되므로 대기 필요)
        login_button = WebDriverWait(driver, 10).until(
          EC.element_to_be_clickable((By.CSS_SELECTOR, f'a[href="{url}"]')))
        driver.execute_script("arguments[0].click();",login_button)
        login_button.click()
        print("사진첩으로 이동 성공!") 


    except Exception as e:
        print("오류 발생:", str(e))
        return jsonify({'status': 'fail', 'message': '로그인 후 내비게이션 바를 찾지 못했습니다.', 'error': str(e)}), 401