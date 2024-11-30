from app import db

class Skill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    priority = db.Column(db.Integer, nullable=False)
    tier = db.Column(db.Text, nullable=True)
    image = db.Column(db.String(100), nullable=True)

    def __repr__(self):
        return f"<Skill {self.name}>"
