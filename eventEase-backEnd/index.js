const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const { testConnection } = require('./src/config/db');
const routes = require('./src/routes');
const MigrationRunner = require('./src/utils/migrationRunner');
const NotificationService = require('./src/services/notificationService');

const PORT = 5000;

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const notificationService = new NotificationService(io);

app.set('io', io);
app.set('notificationService', notificationService);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: '*'  
}));


app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
  req.notificationService = notificationService;
  next();
});

app.get('/', (req, res) => {
  res.send('Hello world');
});


// API Routes
app.use('/api', routes);

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication token required'));
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(new Error('Invalid or expired token'));
    }
    socket.user = user; // Attach user info to socket
    next();
  });
});


io.on('connection', (socket) => {
  console.log('User connected:', socket.id, 'User ID:', socket.user.id);
  
  socket.join(`user_${socket.user.id}`);
  
  socket.join(`role_${socket.user.role}`);
  
  socket.on('join', (room) => {
    socket.join(room);
    console.log(`User ${socket.user.id} joined room: ${room}`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Server Startup
server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
 
  try {
    const migrationRunner = new MigrationRunner();
    await migrationRunner.runMigrations();
   
    // Test database connection on startup
    await testConnection();
   
    console.log('Server initialized successfully');
  } catch (error) {
    console.error('Server initialization failed:', error.message);
  }
});