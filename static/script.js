let socket = null;
let currentUser = null;
let activeRecipient = null;
let isSignupMode = false;
let allUsersList = [];
let onlineUsersList = [];
let typingTimeout = null;

function toggleAuthMode() {
    isSignupMode = !isSignupMode;
    document.getElementById("authTitle").textContent = isSignupMode ? "Create Account" : "Chat App";
    document.getElementById("authSub").textContent = isSignupMode ? "Sign up to start messaging" : "Sign in to start messaging";
    document.getElementById("authBtn").textContent = isSignupMode ? "Sign Up" : "Login";
    document.getElementById("authSwitch").innerHTML = isSignupMode 
        ? 'Already have an account? <a href="javascript:void(0)" onclick="toggleAuthMode()">Login</a>'
        : 'Don\'t have an account? <a href="javascript:void(0)" onclick="toggleAuthMode()">Sign up</a>';
    document.getElementById("authError").textContent = "";
}

async function handleAuth() {
    const u = document.getElementById("authUsername").value.trim();
    const p = document.getElementById("authPassword").value.trim();
    const errorBox = document.getElementById("authError");

    if (!u || !p) {
        errorBox.textContent = "Please fill all fields!";
        return;
    }

    const endpoint = isSignupMode ? "/api/signup" : "/api/login";
    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: u, password: p })
        });
        const data = await res.json();

        if (data.success) {
            if (isSignupMode) {
                alert("Account ban gaya! Ab login karein.");
                toggleAuthMode();
            } else {
                currentUser = data.username;
                initChatApp();
            }
        } else {
            errorBox.textContent = data.error;
        }
    } catch (err) {
        errorBox.textContent = "Server connect nahi ho pa raha!";
    }
}

function initChatApp() {
    document.getElementById("authContainer").style.display = "none";
    document.getElementById("chatApp").style.display = "flex";
    document.getElementById("myUsernameDisplay").textContent = currentUser;
    document.getElementById("myAvatarLetter").textContent = currentUser.charAt(0).toUpperCase();

    // Socket initialize
    socket = io();

    // Server ko connect hone ke baad batayein
    socket.on("connect", () => {
        console.log("Socket connected! Emitting user_connected...");
        socket.emit("user_connected", { username: currentUser });
    });

    socket.on("online_status_update", (users) => {
        onlineUsersList = users;
        renderUsers(allUsersList);
        updateChatHeaderSubtitle();
    });

    socket.on("new_user_registered", (data) => {
        if (data.username !== currentUser) {
            loadRegisteredUsers();
        }
    });

    socket.on("receive_private_message", (msg) => {
        console.log("New message arrived:", msg);
        
        // Agar baat usi user se chal rahi hai toh chat window me append karo
        const isFromPartner = (msg.sender === activeRecipient && msg.recipient === currentUser);
        const isFromMe = (msg.sender === currentUser && msg.recipient === activeRecipient);

        if (isFromPartner || isFromMe) {
            appendMessage(msg);
        }

        if (msg.sender !== currentUser) {
            playNotificationSound();
        }
    });

    socket.on("user_typing_status", (data) => {
        if (data.from === activeRecipient) {
            const subtitle = document.getElementById("chatStatusSubtitle");
            if (data.isTyping) {
                subtitle.textContent = "typing...";
                subtitle.style.color = "#00a884";
            } else {
                updateChatHeaderSubtitle();
            }
        }
    });

    loadRegisteredUsers();
}

async function loadRegisteredUsers() {
    if (!currentUser) return;
    try {
        const res = await fetch(`/api/users?currentUser=${encodeURIComponent(currentUser)}`);
        const data = await res.json();
        allUsersList = data.users;
        renderUsers(allUsersList);
    } catch (e) {
        console.error("Users list load nahi hui:", e);
    }
}

function renderUsers(list) {
    const container = document.getElementById("usersList");
    container.innerHTML = "";

    if (!list || list.length === 0) {
        container.innerHTML = '<p style="padding:15px; color:#888; font-size:13px; text-align:center;">No contacts found.</p>';
        return;
    }

    list.forEach(user => {
        const div = document.createElement("div");
        div.className = "user-card" + (user === activeRecipient ? " active" : "");
        const isOnline = onlineUsersList.includes(user);
        
        div.innerHTML = `
            <div class="avatar">${user.charAt(0).toUpperCase()}</div>
            <div class="user-details">
                <div class="user-card-name">${user}</div>
                <div class="user-card-status">
                    <span class="status-dot ${isOnline ? 'online' : 'offline'}"></span>
                    <span style="color: ${isOnline ? '#00a884' : '#8696a0'}">${isOnline ? 'Online' : 'Offline'}</span>
                </div>
            </div>
        `;
        div.onclick = () => selectUserToChat(user);
        container.appendChild(div);
    });
}

function filterUsers() {
    const query = document.getElementById("userSearchInput").value.toLowerCase();
    const filtered = allUsersList.filter(u => u.toLowerCase().includes(query));
    renderUsers(filtered);
}

async function selectUserToChat(user) {
    activeRecipient = user;
    document.getElementById("chatWithTitle").textContent = user;
    document.getElementById("activeChatAvatar").style.display = "flex";
    document.getElementById("activeChatAvatar").textContent = user.charAt(0).toUpperCase();
    document.getElementById("chatInputArea").style.display = "flex";
    
    document.body.classList.add("mobile-chat-open");

    updateChatHeaderSubtitle();
    renderUsers(allUsersList);

    try {
        const res = await fetch(`/api/messages?u1=${encodeURIComponent(currentUser)}&u2=${encodeURIComponent(user)}`);
        const data = await res.json();
        const box = document.getElementById("messagesContainer");
        box.innerHTML = "";
        if (data.messages && data.messages.length > 0) {
            data.messages.forEach(appendMessage);
        } else {
            box.innerHTML = '<div class="no-chat-selected" style="font-size:13px;">No messages yet. Say hello! 👋</div>';
        }
    } catch (e) {
        console.error("Chat fetch error:", e);
    }
}

function updateChatHeaderSubtitle() {
    if (!activeRecipient) return;
    const isOnline = onlineUsersList.includes(activeRecipient);
    const subtitle = document.getElementById("chatStatusSubtitle");
    subtitle.textContent = isOnline ? "Online" : "Offline";
    subtitle.style.color = isOnline ? "#00a884" : "#8696a0";
}

function backToUserList() {
    document.body.classList.remove("mobile-chat-open");
    activeRecipient = null;
    document.getElementById("chatWithTitle").textContent = "Select a user to chat";
    document.getElementById("activeChatAvatar").style.display = "none";
    document.getElementById("chatStatusSubtitle").textContent = "";
    document.getElementById("chatInputArea").style.display = "none";
    document.getElementById("messagesContainer").innerHTML = `
        <div class="no-chat-selected">
            <i class="fa-solid fa-comments chat-placeholder-icon"></i>
            <h3>Chat App</h3>
            <p>Select any contact from the left list to send real-time personal messages and photos.</p>
        </div>`;
    renderUsers(allUsersList);
}

function handleTypingInput() {
    if (!activeRecipient || !socket) return;
    socket.emit("typing_event", { sender: currentUser, to: activeRecipient, isTyping: true });

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.emit("typing_event", { sender: currentUser, to: activeRecipient, isTyping: false });
    }, 1200);
}

function toggleEmojiPicker() {
    const picker = document.getElementById("emojiPicker");
    picker.style.display = picker.style.display === "none" ? "grid" : "none";
}

function insertEmoji(emoji) {
    const input = document.getElementById("msgInput");
    input.value += emoji;
    input.focus();
    document.getElementById("emojiPicker").style.display = "none";
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file || !activeRecipient || !socket) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const base64Image = event.target.result;
        socket.emit("private_message", { 
            sender: currentUser,
            to: activeRecipient, 
            text: "", 
            image: base64Image 
        });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
}

function appendMessage(msg) {
    const box = document.getElementById("messagesContainer");
    const emptyMsg = box.querySelector(".no-chat-selected");
    if (emptyMsg) emptyMsg.remove();

    const isMe = (msg.sender === currentUser);
    const div = document.createElement("div");
    div.className = "bubble " + (isMe ? "me" : "them");

    let contentHtml = "";
    if (msg.image) {
        contentHtml += `<img src="${msg.image}" class="chat-img" alt="image" />`;
    }
    if (msg.text) {
        contentHtml += `<div>${msg.text}</div>`;
    }

    div.innerHTML = `
        ${contentHtml}
        <div class="msg-footer">
            <span class="timestamp">${msg.time}</span>
            ${isMe ? '<i class="fa-solid fa-check-double ticks"></i>' : ''}
        </div>
    `;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

function sendMsg() {
    const input = document.getElementById("msgInput");
    const text = input.value.trim();
    
    if (!activeRecipient) {
        alert("Pehle kisi user ko select karein!");
        return;
    }
    
    if (text && socket) {
        socket.emit("private_message", { 
            sender: currentUser,
            to: activeRecipient, 
            text: text, 
            image: "" 
        });
        socket.emit("typing_event", { sender: currentUser, to: activeRecipient, isTyping: false });
        input.value = "";
        input.focus();
    }
}

function checkEnter(e) {
    if (e.key === "Enter") sendMsg();
}

function playNotificationSound() {
    const sound = document.getElementById("msgSound");
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }
}

function logout() {
    if (socket) socket.disconnect();
    currentUser = null;
    activeRecipient = null;
    document.body.classList.remove("mobile-chat-open");
    document.getElementById("chatApp").style.display = "none";
    document.getElementById("authContainer").style.display = "flex";
    document.getElementById("authUsername").value = "";
    document.getElementById("authPassword").value = "";
}
