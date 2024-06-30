from flask import Blueprint, request, jsonify
from .models import NoiseData
from .extensions import db
from datetime import datetime, timedelta

main = Blueprint('main', __name__)

@main.route('/noise', methods=['POST'])
def add_noise_data():
    data = request.get_json()
    timestamp = datetime.strptime(data['timestamp'], '%Y-%m-%dT%H:%M:%S')
    noise_level = data['noise_level']
    
    noise_data = NoiseData(timestamp=timestamp, noise_level=noise_level)
    db.session.add(noise_data)
    db.session.commit()
    
    return jsonify({"message": "Data added successfully"}), 201

@main.route('/noise', methods=['GET'])
def get_noise_data():
    try:
        # Imposta un limite di 1000 record per evitare richieste troppo pesanti
        limit = min(int(request.args.get('limit', 100)), 1000)
        
        # Recupera i dati più recenti in base al limite
        data = NoiseData.query.order_by(NoiseData.timestamp.desc()).limit(limit).all()
        
        # Prepara i dati da restituire come JSON
        noise_data = [{
            'timestamp': data_point.timestamp.isoformat(),
            'noise_level': data_point.noise_level
        } for data_point in data]
        
        return jsonify(noise_data), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route('/noise/stats', methods=['GET'])
def get_noise_stats():
    try:
        # Calcola la media del livello di rumore
        avg_noise = db.session.query(func.avg(NoiseData.noise_level)).scalar()
        
        # Conta il numero totale di dati di rumore nel database
        total_count = NoiseData.query.count()
        
        return jsonify({
            'average_noise_level': avg_noise,
            'total_data_points': total_count
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not username or not password or not email:
        return jsonify({"error": "Missing required fields"}), 400

    # Verifica se l'utente esiste già
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"error": "Username already exists"}), 400

    # Crea un nuovo utente
    new_user = User(username=username, password=password, email=email)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201
