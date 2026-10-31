### Real-Time Chat Application
A responsive, browser-based chat application built using Python, Flask, Flask-SocketIO, SQLite, HTML, CSS, and JavaScript. This application allows registered users to communicate privately through real-time messaging.

### 1\. Project Overview

The Real-Time Chat Application is a web-based communication platform that enables users to exchange messages instantly. Users can create an account, log in, view registered contacts, and send private messages without refreshing the webpage.

The application uses Flask for backend development, Flask-SocketIO for real-time communication, and SQLite for storing user information and chat history.

The main objective of this project is to develop a simple, interactive, and user-friendly messaging system using Python web technologies.

### 2\. Features

The application provides the following features:

* User Registration: Allows new users to create an account.

* User Login: Allows registered users to log in.

* Contact List: Displays registered users.

* Private Messaging: Supports one-to-one communication.

* Real-Time Messaging: Messages are delivered instantly without refreshing the page.

* Online/Offline Status: Displays the availability of users.

* Typing Indicator: Shows when another user is typing.

* Image Sharing: Allows users to share images in conversations.

* Emoji Picker: Supports sending emojis in messages.

* Message History: Stores and retrieves previous conversations.

* Notification Sound: Plays a sound when a new message arrives.

* Responsive Interface: Provides a user-friendly interface on different screen sizes.

### 3\. Technologies Used

| Technology     | Purpose                       |
| -------------- | ----------------------------- |
| Python         | Backend programming           |
| Flask          | Web application framework     |
| Flask-SocketIO | Real-time communication       |
| SQLite         | Database management           |
| HTML5          | Webpage structure             |
| CSS3           | Website styling               |
| JavaScript     | Frontend functionality        |
| Gunicorn       | Application deployment server |
| Eventlet       | Asynchronous server support   |

### 4\. Project Structure

The project contains the following files and folders:

```text
Real-time-chat-app-main/
│
├── app.py
├── requirements.txt
├── Procfile
│
├── templates/
│   └── index.html
│
├── static/
│   ├── style.css
│   └── script.js
│
└── chat.db
```

File Description:

* `app.py`: Contains the main Python application, Flask routes, database operations, and Socket.IO events.

* `requirements.txt`: Contains all required Python libraries.

* `Procfile`: Defines the command used to start the application during deployment.

* `index.html`: Provides the structure of the chat interface.

* `style.css`: Defines the design, layout, and styling.

* `script.js`: Handles frontend interactions and real-time messaging.

* `chat.db`: SQLite database used to store user accounts and messages. It is created automatically when the application initializes.

### 5\. System Requirements

Before running the application, make sure the following software is installed:

* Python 3.9 or above.

* Visual Studio Code (optional).

* Web browser such as Google Chrome.

* pip package installer.

* Internet connection for installing dependencies.

Check Python installation:

```bash
python --version
```

Check pip installation:

```bash
python -m pip --version
```

### 6\. Installation and Setup

Follow these steps to install and run the project.

Step 1: Extract the Project

Extract the downloaded ZIP file named `Real-time-chat-app-main.zip`.

Step 2: Open the Project Folder

Open the extracted folder in Visual Studio Code or Command Prompt.

Step 3: Open Terminal

Make sure the terminal is inside the project directory where `app.py` is located.

Step 4: Create a Virtual Environment

```bash
python -m venv venv
```

Step 5: Activate Virtual Environment

For Windows:

```bash
venv\Scripts\activate
```

For macOS/Linux:

```bash
source venv/bin/activate
```

Step 6: Install Required Libraries

```bash
pip install -r requirements.txt
```

This command installs all the required Python packages.

Step 7: Run the Application

```bash
python app.py
```

Step 8: Open the Application

Open your browser and enter:

```text
http://127.0.0.1:5000
```

The Real-Time Chat Application will now open in your browser.

### 7\. How to Use the Application

* Open the application in a web browser.

* Create a new account using the Sign Up option.

* Log in using your registered username and password.

* View the available users in the contact list.

* Select a user to start a private conversation.

* Type a message and click the Send button.

* Exchange messages in real time.

* Use the emoji option to send emojis.

* Use the attachment option to share images.

* Log out when you finish using the application.

To test real-time messaging, create two different accounts and open them in separate browser sessions.

### 8\. Working of the Application

The Real-Time Chat Application works through communication between the frontend, backend, database, and Socket.IO server.

Frontend: HTML, CSS, and JavaScript are used to create the user interface and handle user interactions.

Backend: Flask handles user registration, login, contact lists, and message-related requests.

Database: SQLite stores registered users and chat messages.

Real-Time Communication: Flask-SocketIO establishes a live connection between users and allows messages to be delivered instantly.

Message Delivery Process:

* A user logs into the application.

* The application establishes a Socket.IO connection.

* The user selects another registered user.

* The sender writes and sends a message.

* The server receives the message through a Socket.IO event.

* The message is stored in the SQLite database.

* The server delivers the message to the recipient if they are online.

* The recipient receives the message without refreshing the page.

### 9\. Application Routes and Events

### HTTP Routes

| Route         | Method | Description                 |
| ------------- | ------ | --------------------------- |
| /             | GET    | Opens the main chat page    |
| /api/signup   | POST   | Registers a new user        |
| /api/login    | POST   | Authenticates a user        |
| /api/users    | GET    | Retrieves registered users  |
| /api/messages | GET    | Retrieves previous messages |

### Socket.IO Events

| Event                   | Description                            |
| ----------------------- | -------------------------------------- |
| user_connected          | Connects a user to the chat server     |
| online_status_update    | Updates online user status             |
| new_user_registered     | Notifies about a newly registered user |
| private_message         | Sends a private message                |
| receive_private_message | Receives a private message             |
| typing_event            | Sends typing information               |
| user_typing_status      | Updates typing indicator               |
| disconnect              | Handles user disconnection             |

### 10\. Deployment of the Application

The application can be deployed online using a hosting platform such as Render.

Deployment makes the application accessible through a public URL instead of only running on a local computer.

### Step 1: Create a GitHub Account

Visit [GitHub](https://github.com/?utm_source=chatgpt.com) and sign in or create an account.

### Step 2: Create a New Repository

* Open GitHub.

* Click on New Repository.

* Enter the repository name:

`real-time-chat-application`

* Select the repository visibility.

* Create the repository.

### Step 3: Upload Project to GitHub

Open the terminal in your project folder and execute:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the repository URL with your actual GitHub repository URL.

### Step 4: Create a Render Account

Visit [Render](https://render.com/?utm_source=chatgpt.com) and sign in.

### Step 5: Create a Web Service

* Open the Render Dashboard.

* Click on New.

* Select Web Service.

* Connect your GitHub account.

* Select your project repository.

* Click Connect.

### Step 6: Configure Deployment Settings

Enter the following settings:

| Setting       | Value                                                              |
| ------------- | ------------------------------------------------------------------ |
| Service Name  | real-time-chat-application                                         |
| Runtime       | Python                                                             |
| Branch        | main                                                               |
| Build Command | pip install -r requirements.txt                                    |
| Start Command | gunicorn --worker-class eventlet -w 1 --bind 0.0.0.0:$PORT app:app |

### Step 7: Deploy the Application

* Review the deployment settings.

* Select an available hosting plan.

* Click Deploy Web Service.

* Wait for the build and deployment process to complete.

* Check the deployment logs for errors.

### Step 8: Open the Live Application

After successful deployment, Render provides a public URL.

Open that URL in your browser to access the application online.

Important: The current project needs security improvements and persistent database storage before it should be used as a public messaging service. A successful deployment does not automatically make it production-ready.

### 11\. Deployment Verification

After deployment, test the following functionalities:

* Application opens using the public URL.

* User registration works.

* User login works.

* Contact list is displayed.

* Real-time messages are delivered.

* Message history is retrieved.

* Typing indicator works.

* Online/offline status updates.

* Image sharing works.

* Application remains functional after restarting the service.

### 12\. Troubleshooting

| Problem                    | Solution                                                       |
| -------------------------- | -------------------------------------------------------------- |
| Python not recognized      | Install Python and configure PATH.                             |
| Module not found           | Install dependencies using pip install -r requirements.txt.    |
| Application not opening    | Check whether the Flask server is running.                     |
| Port already in use        | Stop the other process or change the local port.               |
| Messages not delivered     | Check the Socket.IO connection and server logs.                |
| Image not uploading        | Check image size and browser/server errors.                    |
| Deployment failed          | Check Render build and deployment logs.                        |
| Database records disappear | Configure persistent storage or migrate to a managed database. |

### 13\. Security and Production Considerations

The current application is intended for educational and demonstration purposes. Before using it with real users, the following improvements are necessary:

* Implement password hashing instead of storing plain-text passwords.

* Add secure user authentication and session management.

* Verify sender identity on the server instead of trusting browser-supplied usernames.

* Add authorization checks for private conversations.

* Replace the hard-coded secret key with a secure environment variable.

* Restrict Cross-Origin Resource Sharing (CORS) to trusted domains.

* Validate image uploads, file types, and file sizes.

* Use HTTPS for public communication.

* Configure persistent database storage and regular backups.

* Add rate limiting to prevent spam and misuse.

### 14\. Future Scope

The application can be improved by adding the following functionalities:

* Group Chat Functionality.

* End-to-End Encryption.

* Read Receipts.

* Message Editing and Deletion.

* User Profile Pictures.

* Voice and Video Calling.

* Push Notifications.

* Improved Mobile Application Support.

* Better Database Management.

* Advanced User Authentication.

These improvements can make the application more secure, scalable, and user-friendly.

### 15\. Conclusion

The Real-Time Chat Application successfully demonstrates how modern web technologies can be integrated to create an interactive communication platform.

By using Python, Flask, Flask-SocketIO, SQLite, HTML, CSS, and JavaScript, the project provides essential messaging functionalities such as user registration, login, private messaging, image sharing, online status, and typing indicators.

This project provides practical knowledge of backend development, database management, frontend design, and real-time communication.

It also provides a foundation for developing more advanced messaging applications in the future.

### 16\. Project Information

| Field                | Details                    |
| -------------------- | -------------------------- |
| Project Name         | Real-Time Chat Application |
| Project Type         | Web Development            |
| Programming Language | Python                     |
| Framework            | Flask                      |
| Database             | SQLite                     |
| Frontend             | HTML, CSS, JavaScript      |
| Communication        | Flask-SocketIO             |
| Deployment Platform  | Render                     |
| Project Purpose      | Educational Project        |

### 17\. References

* [Python Official Documentation](https://docs.python.org/3/?utm_source=chatgpt.com)

* [Flask Documentation](https://flask.palletsprojects.com/?utm_source=chatgpt.com)

* [Flask-SocketIO Documentation](https://flask-socketio.readthedocs.io/?utm_source=chatgpt.com)

* [SQLite Documentation](https://www.sqlite.org/docs.html?utm_source=chatgpt.com)

* [GitHub Documentation](https://docs.github.com/?utm_source=chatgpt.com)

* [Render Flask Deployment Guide](https://render.com/docs/deploy-flask?utm_source=chatgpt.com)

End of README
