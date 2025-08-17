# PingMe 🚀

A real-time chat application built with Node.js, Express.js, Socket.io, and MySQL. PingMe enables users to engage in both group conversations and personal messaging with file sharing capabilities, real-time notifications, and comprehensive group management features.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)

## 📖 Table of Contents

- [Features](#-features)
- [Technology Stack](#️-technology-stack)
- [Installation & Setup](#-installation--setup)
- [API Endpoints](#-api-endpoints)
- [Security Features](#-security-features)
- [Real-time Features](#-real-time-features)
- [Frontend Features](#-frontend-features)
- [Background Processes](#-background-processes)
- [Deployment](#-deployment-considerations)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

## 🌟 Features

### Core Features
- ✅ **User Authentication**: Secure signup/login with JWT tokens and bcrypt password hashing
- ✅ **Real-time Messaging**: Instant messaging powered by Socket.io
- ✅ **Group Chat**: Create and manage group conversations with multiple participants
- ✅ **Personal Chat**: One-on-one private messaging
- ✅ **File Sharing**: Upload and share images, documents, and other files via AWS S3
- ✅ **Online Status**: Real-time user presence indicators
- ✅ **Message Archival**: Automatic archival of messages older than 24 hours

### Group Management
- 👑 **Admin Controls**: Comprehensive group administration features
- 👥 **Member Management**: Add/remove members from groups
- 🔐 **Admin Rights**: Promote/demote users to/from admin status
- 🏢 **Multi-admin Support**: Groups can have multiple administrators
- ⚠️ **Admin Restrictions**: Prevents removal of the last admin

### Advanced Features
- 🗄️ **Auto-archiving**: Daily cron job to archive old messages for performance optimization
- 📁 **File Type Support**: Images display inline, other files as downloadable links
- 📱 **Responsive Design**: Mobile-friendly interface
- 💾 **Session Management**: Persistent login sessions with localStorage

## 🛠️ Technology Stack

<table>
<tr>
<td align="center">

**Backend**
- Node.js
- Express.js
- Socket.io
- MySQL
- Sequelize ORM
- AWS S3
- JWT
- bcrypt
- multer
- node-cron

</td>
<td align="center">

**Frontend**
- HTML5
- CSS3
- Vanilla JavaScript
- Axios
- Socket.io Client

</td>
<td align="center">

**Database**
- MySQL
- Sequelize ORM

</td>
</tr>
</table>

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL database
- AWS account with S3 access

### 1. Clone the Repository
```bash
git clone https://github.com/AayushSrivastav29/PingMe.git
cd pingme
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Database Configuration
SCHEMA_NAME=your_database_name
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
RDS_ENDPOINT=your_mysql_host

# JWT Secret
SECRET_KEY=your_jwt_secret_key

# AWS S3 Configuration
IAM_USER_KEY=your_aws_access_key
IAM_USER_SECRET=your_aws_secret_key
BUCKET_NAME=your_s3_bucket_name

# Server Configuration
PORT=4000
```

> **⚠️ Important**: Never commit your `.env` file to version control. Add it to `.gitignore`.

### 4. Database Setup
The application will automatically sync database tables on startup. Ensure your MySQL server is running and the database exists.

### 5. Start the Application

**Development Mode:**
```bash
npm run start-dev
```

**Production Mode:**
```bash
npm start
```

🎉 The application will be available at `http://localhost:4000`


## 🔧 API Endpoints

<details>
<summary>📱 Authentication Endpoints</summary>

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/user/add` | User registration | ❌ |
| `POST` | `/api/user/find` | User login | ❌ |
| `GET` | `/api/user/logout` | User logout | ✅ |

</details>

<details>
<summary>👥 User Management Endpoints</summary>

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/user/` | Get all users | ❌ |
| `GET` | `/api/user/online` | Get online users | ❌ |

</details>

<details>
<summary>🏢 Group Management Endpoints</summary>

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| `POST` | `/api/group/create` | Create new group | ✅ | ❌ |
| `GET` | `/api/group/find/:id` | Get user's groups | ❌ | ❌ |
| `GET` | `/api/group/find-group/:groupId` | Get specific group details | ❌ | ❌ |
| `POST` | `/api/group/add-member` | Add member to group | ✅ | ✅ |
| `POST` | `/api/group/remove-member` | Remove member from group | ✅ | ✅ |
| `POST` | `/api/group/make-admin` | Promote user to admin | ✅ | ✅ |
| `POST` | `/api/group/remove-admin` | Demote admin | ✅ | ✅ |

</details>

<details>
<summary>💬 Messaging Endpoints</summary>

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/message/send` | Send group message | ✅ |
| `GET` | `/api/message/get` | Get all messages | ✅ |
| `GET` | `/api/message/group/:groupId` | Get group messages | ✅ |
| `POST` | `/api/pers-message/send` | Send personal message | ✅ |
| `GET` | `/api/pers-message/get/:receiverId` | Get personal messages | ✅ |

</details>

## 🔐 Security Features

- 🔐 **Password Hashing**: Bcrypt with salt rounds for secure password storage
- 🎫 **JWT Authentication**: Secure token-based authentication system
- ✅ **Input Validation**: Server-side validation for all user inputs
- 📎 **File Upload Security**: Multer configuration with type restrictions
- 🌐 **CORS Configuration**: Properly configured cross-origin resource sharing
- 🛡️ **SQL Injection Protection**: Sequelize ORM prevents SQL injection attacks
- 🔒 **Session Security**: Secure session management with token expiration

## ⚡ Real-time Features

### Socket Events

<table>
<tr>
<td>

**📤 Client to Server**
- `user-online` → User comes online
- `disconnect` → User disconnects

</td>
<td>

**📥 Server to Client**
- `new-message` → New group message
- `new-pers-message` → New personal message
- `user-joined` → User comes online
- `user-left` → User goes offline
- `user-removed` → User removed from group

</td>
</tr>
</table>

### Real-time Capabilities
- ⚡ **Instant Messaging**: Messages appear immediately without page refresh
- 🟢 **Live Status Updates**: Real-time online/offline status indicators
- 🔔 **Push Notifications**: Instant notification of new messages
- 👥 **Group Activity**: Real-time updates for group member changes

## 📱 Frontend Features

### User Interface
- 📱 **Responsive Design**: Seamless experience across all devices
- 🎨 **Modern UI**: Clean, intuitive interface with contemporary design
- ⚡ **Real-time Updates**: Instant message delivery and status updates
- 📁 **File Previews**: Image files display inline, other files as download links
- 🎯 **Interactive Elements**: Smooth hover effects and animations

### User Experience
- 💾 **Persistent Sessions**: Login state maintained across browser sessions
- 🟢 **Online Indicators**: Visual indication of user online status
- 👑 **Group Admin Controls**: Easy-to-use admin interface for group management
- 📎 **File Upload**: Intuitive file sharing with visual feedback
- 🔄 **Auto-refresh**: Dynamic content updates without manual refresh

## 🔄 Background Processes

### Message Archival System
- ⏰ **Automated Cleanup**: Daily cron job executes at 2:00 AM
- 🚀 **Performance Optimization**: Moves messages older than 24 hours to archive tables  
- 💾 **Data Retention**: Archived messages remain accessible through API endpoints
- 🔄 **Dual Archival**: Separate archival processes for group and personal messages
- 📊 **Bulk Operations**: Efficient bulk insert and delete operations for optimal performance

### Cron Job Configuration
```javascript
// Runs daily at 2:00 AM
const job = new CronJob('0 2 * * *', () => {
  messageController.archiveOldMessages()
});
```

## 🚀 Deployment Considerations

### Production Readiness Checklist
- [ ] Environment variable configuration
- [ ] Database connection pooling setup
- [ ] Comprehensive error handling and logging
- [ ] File upload size limits configuration
- [ ] HTTPS/SSL certificate installation
- [ ] AWS S3 bucket permissions and CORS policy
- [ ] Rate limiting implementation
- [ ] Security headers configuration

### Recommended Production Setup
```bash
# Process Manager
npm install -g pm2

# Start application with PM2
pm2 start index.js --name "pingme"

# Enable auto-restart on server reboot
pm2 startup
pm2 save
```

### Scalability Considerations
- 🔄 **Horizontal Scaling**: Load balancer configuration for multiple instances
- 🗄️ **Database Optimization**: Proper indexing on frequently queried columns
- 🌐 **CDN Integration**: Content Delivery Network for file sharing
- 📦 **Session Management**: Redis integration for distributed sessions
- 🔍 **Monitoring**: Application performance monitoring setup

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Process
1. 🍴 **Fork** the repository
2. 🔧 **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. ✅ **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 **Push** to the branch (`git push origin feature/AmazingFeature`)
5. 🎯 **Open** a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Issues and Bug Reports
- Use the issue tracker to report bugs
- Provide detailed information about the problem
- Include steps to reproduce the issue

## 📝 License

This project is licensed under the ISC License.



## 🙏 Acknowledgments

Special thanks to the amazing open-source community and the following projects:

- 🌐 **Socket.io Community** - For excellent real-time communication solutions
- 🗄️ **Sequelize Team** - For outstanding ORM documentation and support  
- ☁️ **AWS** - For reliable and scalable cloud storage solutions
- 🚀 **Express.js Team** - For the robust web framework
- 🔐 **JWT.io** - For secure authentication standards

---

<div align="center">

**Made with ❤️ by the PingMe Team**

⭐ **Star us on GitHub** — it helps!

[⬆ Back to Top](#pingme-)

</div>
