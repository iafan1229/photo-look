from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

# 전역 드라이버 변수
driver = None

def start_driver():
    global driver
    if driver is None:
        options = Options()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        
        # Docker 환경에서는 ChromeDriverManager 대신 기본 경로 사용
        driver = webdriver.Chrome(options=options)
        driver.set_window_size(800, 600)
    return driver

def stop_driver():
    global driver
    if driver is not None:
        driver.quit()
        driver = None