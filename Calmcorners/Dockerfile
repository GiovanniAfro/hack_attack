FROM python:3.9-alpine

# Copy all source files
RUN mkdir -p /home/soundsafari
COPY src/ /home/soundsafari/
COPY certs/ /home/soundsafari/certs/

# Expose port 5500
EXPOSE 5500

# Command to run the Python server
CMD ["python3", "/home/soundsafari/server.py"]

