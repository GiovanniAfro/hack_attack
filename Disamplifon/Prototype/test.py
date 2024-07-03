import soundfile as sf
import sys
from pydub import AudioSegment

def invert_audio_phase(file1, file2):
    # Legge il file audio
    data, samplerate = sf.read(file1)
    
    # Inverte la fase dell'audio
    inverted_data = -data
    
    # Scrive l'audio invertito in un nuovo file
    sf.write("temp.wav", inverted_data, samplerate)
    audio1 = AudioSegment.from_file("temp.wav")
    audio2 = AudioSegment.from_file(file2)

    mix = audio1.overlay(audio2)
    mix.export("mix.wav", format='wav')
    print("Fase invertita e mixata con successo")


invert_audio_phase(sys.argv[1], sys.argv[2])