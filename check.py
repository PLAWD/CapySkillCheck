from app.models import Skill, db
from app import create_app

app = create_app()

with app.app_context():
    # Fetch and print all skills
    skills = Skill.query.all()
    if not skills:
        print("No skills found in the database.")
    else:
        for skill in skills:
            print(f"Skill: {skill.name}, Type: {skill.type}, Priority: {skill.priority}, Image: {skill.image}")
