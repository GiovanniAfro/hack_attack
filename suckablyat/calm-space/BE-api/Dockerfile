# Flask Dockerfile
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/home/flaskuser/.local/bin:$PATH"
# Set environment variable for Flask
ENV FLASK_ENV=development

# Create a non-root user and set work directory
RUN useradd -m flaskuser
WORKDIR /app

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN chown -R flaskuser /app
USER flaskuser
RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code and change ownership
COPY --chown=flaskuser . /app/

# Expose the port Flask runs on
EXPOSE 5000

# Run the Flask application
CMD ["flask", "run", "--host=0.0.0.0"]
