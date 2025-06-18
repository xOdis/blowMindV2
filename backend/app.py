from flask import Flask, request, jsonify, redirect, session
from tiktok_api import tiktok_login, get_user_info, upload_video
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY")

@app.route("/api/auth/tiktok")
def auth():
    return redirect(tiktok_login())

@app.route("/api/auth/callback")
def callback():
    # Handle TikTok OAuth callback
    pass

@app.route("/api/auth/status")
def status():
    if "access_token" in session:
        username = get_user_info(session["access_token"])
        return jsonify({"authenticated": True, "username": username})
    return jsonify({"authenticated": False})

@app.route("/api/upload", methods=["POST"])
def upload():
    return upload_video(request, session.get("access_token"))

if __name__ == "__main__":
    app.run(debug=True)
