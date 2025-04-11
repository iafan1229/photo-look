from routes import create_app
import logging
from logging.config import dictConfig

logging_config = {
    'version': 1,
    'formatters': {
        'simple': {
            'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        }
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'level': 'DEBUG',
            'formatter': 'simple',
            'stream': 'ext://sys.stdout'
        },
        'file': {
            'class': 'logging.FileHandler',
            'level': 'DEBUG',
            'formatter': 'simple',
            'filename': 'app.log',
            'mode': 'w'
        }
    },
    'root': {
        'level': 'DEBUG',
        'handlers': ['console', 'file']
    }
}

dictConfig(logging_config)
logger = logging.getLogger(__name__)

app = create_app()

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)