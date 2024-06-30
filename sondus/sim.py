import os
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import numpy as np
import librosa
import time
from joblib import Parallel, delayed

app = Flask(__name__)
socketio = SocketIO(app)

# Variabile globale per gestire lo stato di esecuzione
processing = False

def calculate_time_shift(mic_angle, source_angle, source_distance, R, speed_of_sound):
    mic_angle_rad = np.deg2rad(mic_angle)
    source_angle_rad = np.deg2rad(source_angle)
    d = np.sqrt(R**2 + source_distance**2 - 2 * R * source_distance * np.cos(mic_angle_rad - source_angle_rad))
    time_shift = d / speed_of_sound
    return time_shift

def simulate_microphone_signals(block, num_mics, angles_degrees, source_angle, source_distance, R, speed_of_sound, fs):
    microphone_signals = []
    for mic_angle in angles_degrees:
        time_shift = calculate_time_shift(mic_angle, source_angle, source_distance, R, speed_of_sound)
        shift_samples = int(time_shift * fs)
        shifted_signal = np.zeros_like(block)
        if shift_samples < len(block):
            shifted_signal[shift_samples:] = block[:-shift_samples]
        microphone_signals.append(shifted_signal)
    return microphone_signals

class LMSFilter:
    def __init__(self, filter_length, step_size):
        self.filter_length = filter_length
        self.step_size = step_size
        self.weights = np.zeros(filter_length)

    def adapt(self, input_signal, desired_signal):
        output_signal = np.dot(self.weights, input_signal)
        error_signal = desired_signal - output_signal
        self.weights += 2 * self.step_size * error_signal * input_signal
        return output_signal, error_signal

def anc_lms(reference_signal, primary_signal, filter_length, step_size):
    lms_filter = LMSFilter(filter_length, step_size)
    output_signal = np.zeros_like(primary_signal)
    error_signal = np.zeros_like(primary_signal)
    for i in range(filter_length, len(primary_signal)):
        input_signal = reference_signal[i-filter_length:i]
        output_signal[i], error_signal[i] = lms_filter.adapt(input_signal, primary_signal[i])
    return output_signal, error_signal

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('start_processing')
def start_processing(data):
    global processing
    processing = True

    file_path = data['file_path']
    chunk_size = data['chunk_size']
    num_mics = data['num_mics']
    R = data['R']
    initial_source_distance = data['initial_source_distance']
    oscillation_amplitude = data['oscillation_amplitude']
    initial_source_angle = data['initial_source_angle']
    speed_of_sound = data['speed_of_sound']
    angles_degrees = np.linspace(0, 360, num_mics, endpoint=False)
    filter_length = data['filter_length']
    step_size = data['step_size']
    fs = data['fs']
    window = np.hanning(chunk_size)
    overlap_fraction = 0.5
    hop_size = int(chunk_size * (1 - overlap_fraction))
    segment_duration = 20  # durata di ogni segmento in secondi
    audio_data, _ = librosa.load(file_path, sr=fs)
    segment_samples = segment_duration * fs

    total_segments = len(audio_data) // segment_samples

    def get_source_position(block_index, total_blocks):
        source_distance = initial_source_distance + oscillation_amplitude * np.sin(2 * np.pi * block_index / total_blocks)
        source_angle = initial_source_angle + (block_index * 360 / total_blocks) % 360
        return source_distance, source_angle

    def process_segment(segment_index):
        global processing
        if not processing:
            return

        start = segment_index * segment_samples
        end = min((segment_index + 1) * segment_samples, len(audio_data))
        segment = audio_data[start:end]
        final_signal = np.zeros(len(segment))
        error_signal_total = np.zeros(len(segment))
        combined_signal_total = np.zeros(len(segment))
        overlap_count = np.zeros(len(segment))
        
        total_blocks = len(segment) // hop_size
        interval = 0.1
        chunks_per_interval = int(interval * fs / hop_size)

        def process_block(block_index, start):
            if not processing:
                return None

            end = start + chunk_size
            block = segment[start:end] * window
            source_distance, source_angle = get_source_position(block_index, total_blocks)
            microphone_signals = simulate_microphone_signals(block, num_mics, angles_degrees, source_angle, source_distance, R, speed_of_sound, fs)
            combined_signal = np.mean(microphone_signals, axis=0)
            output_signal, error_signal = anc_lms(combined_signal, block, filter_length, step_size)
            return start, end, error_signal, block - error_signal

        results = Parallel(n_jobs=-1)(delayed(process_block)(block_index, start) for block_index, start in enumerate(range(0, len(segment) - chunk_size, hop_size)))

        for block_index, result in enumerate(results):
            if result is None:
                return
            start, end, error_signal, combined_signal = result
            final_signal[start:end] += error_signal
            error_signal_total[start:end] += error_signal
            combined_signal_total[start:end] += combined_signal
            overlap_count[start:end] += window

            if block_index % chunks_per_interval == 0:
                final_signal_normalized = final_signal / np.where(overlap_count == 0, 1, overlap_count)
                error_signal_total_normalized = error_signal_total / np.where(overlap_count == 0, 1, overlap_count)
                combined_signal_total_normalized = combined_signal_total / np.where(overlap_count == 0, 1, overlap_count)
                energia_originale = np.sum(segment**2)
                energia_finale = np.sum(combined_signal_total_normalized**2)
                riduzione_rumore_db = 10 * np.log10(energia_originale / energia_finale)
                socketio.emit('update', {
                    'final_signal': final_signal_normalized[start:end].tolist(),
                    'error_signal': error_signal_total_normalized[start:end].tolist(),
                    'combined_signal': combined_signal_total_normalized[start:end].tolist(),
                    'riduzione_rumore_db': riduzione_rumore_db
                })
                time.sleep(interval)
    
    for segment_index in range(total_segments):
        if not processing:
            break
        process_segment(segment_index)

@socketio.on('stop_processing')
def stop_processing():
    global processing
    processing = False

if __name__ == '__main__':
    if not os.path.exists('uploaded_files'):
        os.makedirs('uploaded_files')
    socketio.run(app, debug=True, port=5001)

