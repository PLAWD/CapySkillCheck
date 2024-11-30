from flask import Blueprint, render_template, jsonify
from app.models import Skill  # Import your Skill model

# Define the blueprint
main = Blueprint("main", __name__)

@main.route("/")
def index():
    skills = Skill.query.all()  # Fetch skills from the database
    return render_template("index.html", skills=skills)

@main.route("/api/skills")
def get_skills():
    base_path = "/static/images/skills/"
    skills = Skill.query.all()
    return jsonify([
        {
            "id": skill.id,
            "name": skill.name,
            "type": skill.type,
            "priority": skill.priority,
            "image": f"{base_path}{skill.image}" if skill.image else None,  # Prepend base path
            "tier": skill.tier
        }
        for skill in skills
    ])

