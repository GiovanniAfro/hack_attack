ISTRUZIONI PER IL MONTAGGIO DEL DOCKER:




docker build -t soundsafari .

docker run -d -p 5500:5500 --name soundsafari-container soundsafari
