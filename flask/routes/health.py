from flask import Blueprint, jsonify

health = Blueprint('health', __name__)

@health.route('/front/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'flask-backend'
    }), 200
