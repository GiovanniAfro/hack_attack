import logging
from flask import Flask
from .config import Config
from .extensions import db, migrate
from .routes import main

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Configura il logging
    configure_logging(app)
    
    db.init_app(app)
    migrate.init_app(app, db)
    
    app.register_blueprint(main)
    
    # Gestione delle eccezioni globali
    @app.errorhandler(Exception)
    def handle_exception(error):
        app.logger.error(f"An error occurred: {str(error)}")
        return jsonify({"error": str(error)}), 500
    
    return app

def configure_logging(app):
    # Configurazione del logging
    handler = logging.StreamHandler()
    handler.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.INFO)
