from .extensions import db

class NoiseData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    level = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=db.func.now())

    def serialize(self):
        return {
            'id': self.id,
            'level': self.level,
            'timestamp': self.timestamp.isoformat()
        }

from .extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)

    def __repr__(self):
        return f"<User {self.username}>"
