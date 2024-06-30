from flask import Flask, jsonify, request
from flask_cors import CORS
from pydub import AudioSegment
import numpy as np
import io
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)

app = Flask(__name__)
CORS(app)
logger = logging.getLogger(__name__)

    #Calculate the average decibel level of the audio segment.
    #:param audio_segment: pydub.AudioSegment object
    #:return: Average decibel level
def calculate_average_db(audio_segment):
    samples = np.array(audio_segment.get_array_of_samples())
    # Convert samples to dB
    samples_db = 20 * np.log10(np.abs(samples) + 1e-10)  # Adding small value to avoid log(0)
    # Calculate the average dB level
    average_db = np.mean(samples_db)
    return average_db

def normalize_db(db_value, original_min, original_max, new_min, new_max):
    # Normalize the db_value from original range to new range
    normalized_value = (db_value - original_min) / (original_max - original_min) * (new_max - new_min) + new_min
    # Ensure the value is within the new range
    return max(min(normalized_value, new_max), new_min)

def calculate_normalized_average_db(audio_segment):
    average_db = calculate_average_db(audio_segment)
    # Assuming the original dB range is -200 to 0
    normalized_db = normalize_db(average_db, -200, 0, 0, 500)
    return normalized_db

@app.route('/process-data', methods=['POST'])
def process_data():
    if 'file' not in request.files:
        return jsonify(error='No file part'), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify(error='No selected file'), 400
    audio_data = file.read()

    # ------------------------------- log per debug ------------------------------ #
    logger.debug(f"Received audio data type: {type(audio_data)}")
    logger.debug(f"Received audio data length: {len(audio_data)}")
    logger.debug(f"Received audio data sample: {audio_data[:100]}")

    audio_segment = AudioSegment.from_file(io.BytesIO(audio_data), format='wav')
    try:
        # average_db = calculate_average_db(audio_segment)
        average_db = calculate_normalized_average_db(audio_segment)
        logger.debug(f"hellooooo{average_db}")
        return jsonify(average_db=average_db)
    except Exception as e:
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')