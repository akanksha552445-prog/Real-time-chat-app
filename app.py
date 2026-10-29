import sqlite3
import socket
from datetime import datetime
from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = "clean-working-chat-key-999"
socketio = SocketIO(app, cors_allowed_origins="*", max_http_buffer_size=15*1024*1024)

DB_FILE = "chat.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL
                )''')
    c.execute('''CREATE TABLE IF NOT EXISTS messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    sender TEXT NOT NULL,
                    recipient TEXT NOT NULL,
                    message TEXT,
                    image TEXT,
                    timestamp TEXT NOT NULL
                )''')
    conn.commit()
    conn.close()

init_db()

# Online users tracking
# user_to_sid: { "Akaash": "socket_id_123" }
# sid_to_user: { "socket_id_123": "Akaash" }
user_to_sid = {}
sid_to_user = {}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json or {}
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if not username or not password:
        return jsonify({"success": False, "error": "Username aur password dono bharein!"})

    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    try:
        c.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
        conn.commit()
        conn.close()
        socketio.emit("new_user_registered", {"username": username})
        return jsonify({"success": True})
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"success": False, "error": "Yeh username pehle se exist karta hai!"})

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json or {}
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
    user = c.fetchone()
    conn.close()

    if user:
        return jsonify({"success": True, "username": username})
    return jsonify({"success": False, "error": "Galat username ya password!"})

@app.route("/api/users", methods=["GET"])
def get_users():
    current = request.args.get("currentUser", "")
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT username FROM users WHERE username != ?", (current,))
    users = [row[0] for row in c.fetchall()]
    conn.close()
    return jsonify({"users": users})

@app.route("/api/messages", methods=["GET"])
def get_messages():
    u1 = request.args.get("u1")
    u2 = request.args.get("u2")
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''SELECT sender, recipient, message, image, timestamp FROM messages 
                 WHERE (sender = ? AND recipient = ?) OR (sender = ? AND recipient = ?)
                 ORDER BY id ASC''', (u1, u2, u2, u1))
    rows = c.fetchall()
    conn.close()
    messages = [{"sender": r[0], "recipient": r[1], "text": r[2], "image": r[3], "time": r[4]} for r in rows]
    return jsonify({"messages": messages})

# --- Direct Socket ID Communication ---

@socketio.on("user_connected")
def handle_user_connected(data):
    username = data.get("username")
    if not username:
        return
    
    # User ko current socket ID se map karo
    user_to_sid[username] = request.sid
    sid_to_user[request.sid] = username
    
    print(f"[ONLINE] {username} connected with SID: {request.sid}")
    emit("online_status_update", list(user_to_sid.keys()), broadcast=True)

@socketio.on("private_message")
def handle_private_message(data):
    sender = data.get("sender") or sid_to_user.get(request.sid)
    recipient = data.get("to")
    text = (data.get("text") or "").strip()
    image_data = data.get("image") or ""

    if not sender or not recipient or (not text and not image_data):
        print("[ERROR] Missing message details:", sender, recipient, text)
        return

    time_str = datetime.now().strftime("%I:%M %p")

    # DB me store karein
    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute("INSERT INTO messages (sender, recipient, message, image, timestamp) VALUES (?, ?, ?, ?, ?)",
                  (sender, recipient, text, image_data, time_str))
        conn.commit()
        conn.close()
    except Exception as e:
        print("[DB ERROR]:", e)

    payload = {
        "sender": sender,
        "recipient": recipient,
        "text": text,
        "image": image_data,
        "time": time_str
    }

    print(f"[MSG] From {sender} to {recipient}: {text or '[Image]'}")

    # 1. Recipient online hai toh uske direct socket ID par bhejo
    recipient_sid = user_to_sid.get(recipient)
    if recipient_sid:
        emit("receive_private_message", payload, to=recipient_sid)

    # 2. Sender ko turant wapis emit karo
    emit("receive_private_message", payload, to=request.sid)

@socketio.on("typing_event")
def handle_typing_event(data):
    sender = data.get("sender") or sid_to_user.get(request.sid)
    recipient = data.get("to")
    is_typing = data.get("isTyping", False)

    recipient_sid = user_to_sid.get(recipient)
    if recipient_sid:
        emit("user_typing_status", {"from": sender, "isTyping": is_typing}, to=recipient_sid)

@socketio.on("disconnect")
def handle_disconnect():
    username = sid_to_user.get(request.sid)
    if username:
        if user_to_sid.get(username) == request.sid:
            del user_to_sid[username]
        del sid_to_user[request.sid]
        print(f"[OFFLINE] {username} disconnected")
        emit("online_status_update", list(user_to_sid.keys()), broadcast=True)

if __name__ == "__main__":
    hostname = socket.gethostname()
    try:
        local_ip = socket.gethostbyname(hostname)
    except:
        local_ip = "127.0.0.1"

    print("\n" + "="*50)
    print(f"Laptop URL: http://127.0.0.1:5000")
    print(f"Phone URL:  http://{local_ip}:5000")
    print("="*50 + "\n")

    socketio.run(app, host="0.0.0.0", port=5000, debug=True)