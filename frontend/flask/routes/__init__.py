# api/app/routes/__init__.py
from flask import Flask
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})  # 여기에 CORS 설정 추가

    # 라우트 등록
    from .verifyComment import verify_comment as verify_comment_blueprint  # 새로운 블루프린트 임포트

    app.register_blueprint(verify_comment_blueprint)  # 새로운 블루프린트 등록

    return app

