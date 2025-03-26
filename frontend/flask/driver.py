from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options


# 전역 드라이버 변수
driver = None


def start_driver():
    global driver
    if driver is None:
        options = Options()
        # options.add_argument("--headless")  # 헤드리스 모드
        service = Service(executable_path=ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service,options=options)
        driver.set_window_size(800, 600)
    return driver

def stop_driver():
    global driver
    if driver is not None:
        driver.quit()
        driver = None