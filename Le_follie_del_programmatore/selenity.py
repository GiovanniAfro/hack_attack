#!/usr/bin/env python3

from kivy.lang import Builder
from kivymd.app import MDApp
from kivymd.uix.bottomnavigation import MDBottomNavigation, MDBottomNavigationItem
from kivymd.uix.label import MDLabel
from kivymd.uix.toolbar import MDTopAppBar
from kivy.core.window import Window
from kivy.graphics import Color, Rectangle
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.recycleview import RecycleView
from kivy.properties import StringProperty
from kivymd.uix.button import MDIconButton
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.factory import Factory
from kivy.uix.popup import Popup
from kivy.uix.textinput import TextInput
from kivy.uix.filechooser import FileChooserListView
from kivy.uix.filechooser import FileChooserIconView
from kivy.clock import Clock
from kivy.core.audio import SoundLoader
from kivy.app import App
from kivy.uix.slider import Slider
from mutagen.mp3 import MP3
from kivy.metrics import dp
import os
import pygame
import pyaudio
import threading
import time
import librosa
import sounddevice as sd
import pydub
import os
import numpy as np
import wave


kv = '''
BoxLayout:
    padding: 0
    margin: 0
    orientation: 'vertical'

    MDTopAppBar:
        title: "Serenity"
        md_bg_color: 0.302, 0.275, 0.404, 1  # Set the background color here

    MDBottomNavigation:
        id: bottom_navigation
        panel_color: 0.973, 0.937, 0.871, 1

        MDBottomNavigationItem:
            name: 'screen1'
            text: "Home"
            icon: 'home'
            
            BoxLayout:
                orientation: 'vertical'
                padding: dp(48)

                canvas.before:
                    Color:
                        rgba: 0.663, 0.784, 0.863, 1  # Celeste scuro per screen1
                    Rectangle:
                        size: self.size
                        pos: self.pos

                BoxLayout:
                    orientation: 'vertical'
                    spacing: dp(20)
                    
                    # First Carousel
                    ScrollView:
                        do_scroll_x: True
                        do_scroll_y: False
                        size_hint_y: None
                        height: dp(90)  # Adjust height to fit button size

                        MDBoxLayout:
                            orientation: 'horizontal'
                            spacing: dp(10)
                            padding: dp(10)
                            size_hint_x: None
                            width: self.minimum_width
                            id: carousel_box_1

                            BoxLayout:
                                id: to_fill
                                orientation: 'vertical'

                    # Second Carousel
                    ScrollView:
                        do_scroll_x: True
                        do_scroll_y: False
                        size_hint_y: None
                        height: dp(90)  # Adjust height to fit button size

                        MDBoxLayout:
                            orientation: 'horizontal'
                            spacing: dp(10)
                            padding: dp(10)
                            size_hint_x: None
                            width: self.minimum_width
                            id: carousel_box_2

                    # Main logo
                    Image:
                        size_hint: None, None
                        size: dp(100), dp(100)
                        pos_hint: {'center_x': 0.5}
                        allow_stretch: True
                        id: main_logo
                    MDLabel:
                        text: "Welcome to Serenity"
                        halign: 'center'
                        size_hint_y: None
                        height: dp(40)
                        font_size: sp(20)

                # MDLabel:
                #     text: "Welcome to Serenity\\nYour personal music experience.\\n\\nStart here!"
                #     halign: 'center'
        
        MDBottomNavigationItem:
            name: 'screen2'
            text: "Record"
            icon: 'microphone'
            BoxLayout:
                orientation: 'vertical'
                canvas.before:
                    Color:
                        rgba: 0.663, 0.784, 0.863, 0.8  # Celeste scuro per screen1
                    Rectangle:
                        size: self.size
                        pos: self.pos
                # MDTopAppBar:
                #     MDBottomNavigation:
                #         orientation: 'horizontal'
                #         MDIconButton:
                #             size_hint_y: None
                #             height: dp(18)
                #             # canvas.before:
                #             #    Color:
                #             #       rgba: 0.0, 0.0, 1.0, 1  # Celeste scuro per screen2
                #             icon: "menu"
                #             on_release: app.root.ids.bottom_navigation.open()
                #         MDIconButton:
                #             size_hint_y: None
                #             height: dp(18)
                #             icon: "none"
                #             canvas.before:
                #                 Color:
                #                     rgba: 0.0, 0.0, 1.0, 1  # Celeste scuro per screen2
                            
                #         MDIconButton:
                #             size_hint_y: None
                #             height: dp(18)
                #             icon: "menu"
                #             on_release: app.open_file_chooser()     
                    
                
                MDLabel:
                    text: "Record your music"
                    halign: 'center'
                    size: dp(150), dp(150)
                    theme_text_color: "Custom"
                    text_color: 0.2, 0.2, 0.8, 1
                    font_style: "Subtitle1"
                    height: dp(20)
                    
                BoxLayout:
                    orientation: 'horizontal'
                    AnchorLayout:
                        padding: dp(24)  # Aggiunge il padding sotto il bottone
                        anchor_x: 'left'
                        anchor_y: 'bottom'
                        MDFloatingActionButton:
                            icon: "menu"
                            md_bg_color: 0, 0, 0.2, 1
                            on_press: app.show_recs()
                    AnchorLayout:
                        padding: dp(24)  # Aggiunge il padding sotto il bottone
                        anchor_x: 'center'
                        anchor_y: 'bottom'  
                        MDFloatingActionButton:
                            md_bg_color: 0.7, 0.7, 0.7, 1
                            icon: "microphone"
                            on_press: app.toggle_recording(self)
                    AnchorLayout:
                        padding: dp(24)  # Aggiunge il padding sotto il bottone
                        anchor_x: 'right'
                        anchor_y: 'bottom'
                        MDFloatingActionButton:
                            icon: "save"
                            md_bg_color: 0, 0, 0.2, 1
                            on_press: app.save_rec()
                            
        MDBottomNavigationItem:
            name: 'screen3'
            text: "Library"
            icon: 'music-circle'
            BoxLayout:
                orientation: 'vertical'
                margin: 10
                canvas.before:
                    Color:
                        rgba: 0.663, 0.784, 0.863, 0.8  # Celeste scuro per screen1
                    Rectangle:
                        pos: self.pos
                        size: self.size
                BoxLayout:
                    orientation: 'horizontal'
                    size_hint_y: 0.7
                    size_hint_x: 1
                    
                    BoxLayout:
                        orientation: 'horizontal'
                        padding: [dp(0), dp(0), dp(0), dp(25)] #
                        size_hint_x: 0.1
                        

                    MDTextField:
                        id: search_field
                        size_hint_x: 0.7  # Imposta la larghezza al massimo consentito dal genitore
                        hint_text: " Cerca su Internet..."
                        radius: [50, 50, 50, 50] # Arrotonda i bordi
                        padding: [dp(0), dp(25), dp(25), dp(0)] #
                        mode: "rectangle"
                        
                        pos_hint: {'center_x': 0.5}
                        width: dp(250)
                        pos_hint: {'center_y': 0.5}
                        on_text_validate: app.search_on_internet()

                    MDIconButton:
                        icon: "earth" # Icona a destra
                        user_font_size: "24sp"
                        pos_hint: {'center_y': 0.5}


                ScrollView:
                    orientation: 'vertical'
                    size_hint_y: 2.5
                    padding: 20 # Aggiunge il padding intorno al contenuto
                    spacing: dp(10) # Aggiunge lo spazio tra i widget
                    canvas.before: 
                        Color:
                            rgba: 0.302, 0.275, 0.404, 0.2  # Colore del rettangolo (azzurro semi-trasparente)
                        Rectangle:
                            pos: self.pos 
                            size: self.size
                    FileChooserListView:

                        id: file_chooser
                        size_hint_y: 2
                        height: self.parent.height  # Imposta l'altezza al massimo consentito dal genitore (ScrollView)
                        on_selection: app.on_file_selection(file_chooser.selection)
                        text_color: 0, 0, 1, 1  # Imposta il colore del testo (blu pieno)

                RecycleView:
                    id: rv
                    text: "Playlist"
                    viewclass: 'MusicItem'
                    RecycleBoxLayout:
                        orientation: 'vertical'
                        default_size: None, dp(56)
                        default_size_hint: 1, None
                        size_hint_y: None
                        height: self.minimum_height
                        spacing: dp(2)

                BoxLayout:
                    id: slider_layout
                    padding: dp(25) # Aggiunge il padding intorno al contenuto
                    size_hint_y: 0.3
                    Slider:
                        id: audio_slider
                        min: 0
                        max: 180
                        value: 0
                               
                BoxLayout:
                    orientation: 'horizontal'
                    # padding: 10
                    spacing: 40
                    size_hint_y: 0.5
                    canvas.before:
                        Color:
                            rgba: 0.7, 0.7, 0.7, 1  # Colore del rettangolo (azzurro semi-trasparente)
                        Rectangle:
                            pos: self.pos
                            size: self.size
                    BoxLayout:
                        pos_hint_y: 0.5
                    MDIconButton:
                        id: play_button
                        icon: "play"
                        pos_hint: {'center_x': 0.5}
                        on_release: app.change_icon(self, self)
                            
                    MDIconButton:
                        id: stop_button
                        icon: "stop"
                        pos_hint: {'center_x': 0.5}
                        on_release: app.change_icon(play_button, self)

                    MDIconButton:
                        id: pause_button
                        icon: "repeat-off"
                        pos_hint: {'center_x': 0.5}
                        on_release: app.repeat_audio(self)
                    BoxLayout:
                        pos_hint: {'center_x': 0.5}
        MDBottomNavigationItem:
            orientation: 'vertical'
            name: 'screen4'
            text: "Settings"
            icon: 'cog'
            md_bg_color: 0.663, 0.784, 0.863, 1  # Set the background color here

            MDLabel:
                orientation: 'horizontal'
                text: "Comming soon..."
                halign: 'center'
                font_style: "Subtitle1"
                size: dp(150), dp(150)
                theme_text_color: "Custom"
                text_color: 0.2, 0.2, 0.8, 1
'''


class MusicItem(BoxLayout):
    text = StringProperty()

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'horizontal'
        self.add_widget(MDLabel(text=self.text, halign='left'))

class RV(RecycleView):
    pass

class MyApp(MDApp):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.title = "My Music App"
        self.audio_files = []
        pygame.init()
        pygame.mixer.init()
        self.first_call = True
        self.selected_file = None
        self.nc_act = False
        self.p = pyaudio.PyAudio()
        self.shidden = False
        self.init_path = os.path.expanduser('~')
        self.recording = False
        self.paused = False
        self.frames = []
        self.stream = None
        self.recording_thread = None
        self.chunk = 1024  # Record in chunks of 1024 samples
        self.format = pyaudio.paInt16  # 16 bits per sample
        self.channels = 2
        self.rate = 44100  # Record at 44100 samples per second
        self.dir_sel = "."
        self.filename = "audio"
        self.rec_path = os.path.expanduser('~/Recordings')
        self.playback_start_time = None
        self.repeat = False
        self.dir_files = []
        self.index = 0

    def build(self):
        self.root = Builder.load_string(kv)  # Assicurati che self.root sia assegnato qui
        
        downloads_path = os.path.expanduser(self.init_path)
        self.root.ids.file_chooser.path = downloads_path
        return self.root
    
    Window.size = (360, 640)
    # def on_start(self):
    #    Window.size = (360, 640)  # Set window size based on screen dimensions
    #    if self.root:
    #       self.root.ids.bottom_navigation.bind(on_tab_switch=self.on_tab_switch)
    # def on_tab_switch(self, instance, value):
    #    # Your logic here
    #    print(f"Switched to tab: {value}")

    def change_icon(self, button, button2):
        if button2.icon == "stop":
            button.icon = "play"
            self.stop_audio()
        elif button.icon == "play" and self.selected_file:
            button.icon = "pause"
            self.play_audio()
        elif button.icon == "pause":
            button.icon = "play"
            self.play_audio()
    def search_on_internet(self):
        # Implementa qui la logica per la ricerca su internet
        import webbrowser
        webbrowser.open(f"https://www.google.com/search?q={self.root.ids.search_field.text}")  # Sostituisci con il tuo URL di ricerca

    def play_audio(self):
        if self.first_call:
            self.first_call = False
            file_dir = '/'.join(self.selected_file.split('/')[:-1])
            self.dir_files = self.get_files_in_dir(file_dir)
            self.index = self.dir_files.index(self.selected_file)
            pygame.mixer.music.load(self.selected_file)
            get_length = MP3(self.selected_file)
            self.root.ids.audio_slider.max = get_length.info.length
            pygame.mixer.music.play()
            Clock.schedule_interval(self.update_slider, 1)
            pygame.mixer.music.set_endevent(pygame.USEREVENT)
        else:
            if pygame.mixer.music.get_busy():
                pygame.mixer.music.pause()
            else:
                pygame.mixer.music.unpause()
        
    def get_files_in_dir(self, directory_path):
        files = []
        for item in os.listdir(directory_path):
            full_path = os.path.join(directory_path, item)
            if os.path.isfile(full_path):
                files.append(full_path)
        return files

    def stop_audio(self):
        pygame.mixer.music.stop()
        self.first_call = True
        Clock.unschedule(self.update_slider)
        self.root.ids.audio_slider.value = 0

    def on_event(self, event):
        if event.type == pygame.USEREVENT:
            if self.repeat:
                self.stop_audio()
                self.play_audio()
            else:
                if self.index < len(self.dir_files):
                    self.index += 1
                else:
                    self.index = 0
                while not self.dir_files[self.index].endswith(('.mp3', '.wav', '.ogg')):
                    self.index += 1
                self.selected_file = self.dir_files[self.index]
                self.stop_audio()
                self.play_audio()
            
        
    def repeat_audio(self, button):
        self.repeat = not self.repeat
        button.icon = "repeat" if self.repeat else "repeat-off"


    def update_slider(self, dt):
        if pygame.mixer.music.get_busy():
            pos = pygame.mixer.music.get_pos() / 1000
            self.root.ids.audio_slider.value = pos
        else:
            return

    def toggle_recording(self, button):
        if self.recording:
            if self.paused:
                button.md_bg_color = (1, 0, 0, 1)
                self.paused = False
            else:
                button.md_bg_color = (0.7, 0.7, 0.7, 1)
                self.paused = True
        else:
            button.md_bg_color = (1, 0, 0, 1)
            self.start_recording()

    def start_recording(self):
        self.recording = True
        self.paused = False
        self.frames = []
        self.stream = self.p.open(format=self.format,
                                channels=self.channels,
                                rate=self.rate,
                                input=True,
                                frames_per_buffer=self.chunk)
        self.recording_thread = threading.Thread(target=self.record)
        self.recording_thread.start()

    def record(self):
        while self.recording:
            if not self.paused:
                data = self.stream.read(self.chunk)
                self.frames.append(data)

    def stop_recording(self):
        self.recording = False
        if self.recording_thread:
            self.recording_thread.join()
        if self.stream:
            self.stream.stop_stream()
            self.stream.close()

    def save_rec(self):
        if self.recording:
            self.stop_recording()
            
        content = BoxLayout(orientation='vertical')
        actual_directory = os.getcwd()
        filechooser = FileChooserIconView(dirselect=True, path=actual_directory)
        content.add_widget(filechooser)
        
        button_layout = BoxLayout(size_hint_y=None, height='50dp')
        confirm_button = Button(text='Confirm')
        cancel_button = Button(text='Cancel')
        Text_Input = TextInput(text=self.filename)
        button_layout.add_widget(Text_Input)
        button_layout.add_widget(confirm_button)
        button_layout.add_widget(cancel_button)
        content.add_widget(button_layout)
        
        popup = Popup(title="Choose directory", content=content, size_hint=(0.9, 0.9))
        
        Text_Input.bind(text=self.update_filename)
        confirm_button.bind(on_press=lambda x: self.directory_selected(filechooser, filechooser.selection, popup))
        cancel_button.bind(on_press=popup.dismiss)
        
        popup.open()

    def update_filename(self, instance, value):
        self.filename = value

    def directory_selected(self, filechooser, selection, popup):
        if selection:
            selected_directory = selection[0]
            self.dir_sel = selected_directory
        path = os.path.join(self.dir_sel, f"{self.filename}.wav")
        if os.path.isdir(path):
            raise IsADirectoryError(f"Expected a file path, got a directory: '{path}'")
        
        with wave.open(path, 'wb') as wf:
            wf.setnchannels(self.channels)
            wf.setsampwidth(self.p.get_sample_size(self.format))
            wf.setframerate(self.rate)
            wf.writeframes(b''.join(self.frames))
            wf.close()
        popup.dismiss()

    def on_close(self, *args):
        if self.recording_thread is not None:
            self.recording_thread_stop = True
            self.recording_thread.join()

        if self.stream is not None:
            self.stream.stop_stream()
            self.stream.close()
            self.stream = None

        pyaudio.PyAudio().terminate()
        return True

    Window.bind(on_close=on_close)

    def open_file_chooser(self):
        self.root.ids.bottom_navigation.set_current("screen3")  # Switch to 'screen3'
        self.root.ids.file_chooser.path = self.init_path
        extensions = ['*.mp3', '*.wav', '*.ogg']
        self.root.ids.file_chooser.filters = extensions
        self.root.ids.file_chooser.show_hidden = self.shidden

    def on_file_selection(self, selection):
        self.selected_file = selection[0] if selection else None
        extensions = ('.mp3', '.wav', '.ogg')
        if self.selected_file and self.selected_file.endswith(extensions):
            self.audio_files.append(self.selected_file)
            self.update_library_view()

    def show_recs(self):
        pass

    def update_library_view(self):
        self.root.ids.rv.data = [{'text': file} for file in self.audio_files]

    def on_start(self):
        Clock.schedule_interval(self.check_events, 0.1)
        image_size = dp(100)  # Define a fixed image size
        image_folder = 'images/'


        def add_images_to_carousel(carousel_box, flag):
            for i in range(5):
                if flag == 1:
                    image_path = os.path.join(image_folder, f"img_{i + 1}.png")
                else:
                    image_path = os.path.join(image_folder, f"img_{i + 6}.png")
                abs_image_path = os.path.abspath(image_path)
                print(f"Trying to load image: {abs_image_path}")
                if not os.path.exists(abs_image_path):
                    print(f"Image not found: {abs_image_path}")
                    continue
                btn = Button(
                    size_hint=(None, None),
                    size=(image_size, image_size),
                    background_normal=abs_image_path,
                    background_color=(1, 1, 1, 1),
                    # on_release=lambda x: self.load_library_content()
                )
                carousel_box.add_widget(btn)

        # Add images to the first carousel
        carousel_box_1 = self.root.ids.carousel_box_1
        add_images_to_carousel(carousel_box_1, 1)

        # Add images to the second carousel
        carousel_box_2 = self.root.ids.carousel_box_2
        add_images_to_carousel(carousel_box_2, 2)

        image_path = os.path.join(image_folder, f"main_logo.png")
        self.root.ids.main_logo.source = image_path

    def check_events(self, dt):
        for event in pygame.event.get():
            self.on_event(event)

if __name__ == "__main__":
    MyApp().run()
