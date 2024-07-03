import librosa
import numpy as np
import soundfile as sf

# Carica i file audio
def load_audio(file_path):
    audio, sr = librosa.load(file_path, sr=None)
    return audio, sr

# Inverti la fase del file audio
def invert_phase(audio):
    return -audio

# Applica il frammento in controfase in loop lungo tutta la durata del file audio
def apply_inverted_loop_full(signal_audio, pattern_audio):
    pattern_length = len(pattern_audio)
    signal_length = len(signal_audio)
    
    # Crea il loop del frammento in controfase per coprire l'intero segnale
    inverted_loop = np.tile(pattern_audio, int(np.ceil(signal_length / pattern_length)))
    inverted_loop = inverted_loop[:signal_length]
    
    # Sovrapponi il frammento in controfase al segnale originale
    processed_audio = signal_audio - inverted_loop
    
    return processed_audio

# Salva il file audio
def save_audio(file_path, audio, sr):
    sf.write(file_path, audio, sr)

# Percorsi dei file audio
pattern_path = 'controfase.wav'  # Percorso del frammento audio
signal_path = 'voice.wav'       # Percorso del file principale
output_path = 'output.wav'

# Carica i file audio
pattern_audio, pattern_sr = load_audio(pattern_path)
signal_audio, signal_sr = load_audio(signal_path)

# Assicura che i tassi di campionamento siano uguali
assert pattern_sr == signal_sr, "I tassi di campionamento dei due file devono essere uguali."

# Inverti la fase del frammento audio
pattern_audio_inverted = invert_phase(pattern_audio)

# Applica il frammento in controfase in loop lungo tutta la durata del file audio
processed_audio = apply_inverted_loop_full(signal_audio, pattern_audio_inverted)

# Salva il file audio processato
save_audio(output_path, processed_audio, signal_sr)
print(f"Audio processato salvato in: {output_path}")

