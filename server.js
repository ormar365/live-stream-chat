const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*", // Allow all origins for now; replace "*" with specific URLs for production
        methods: ["GET", "POST"]
    }
});

app.use(express.static(__dirname)); // Serve static files like styles or images

// Serve the chat page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Helper function to generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


// Sanitize usernames to prevent HTML injection
const sanitizeUsername = (username) => {
    return username.replace(/[<>]/g, ""); // Remove angle brackets
};

// Handle chat messages and usernames
io.on('connection', (socket) => {
    console.log('A user connected');

    // Assign a random color to each user
    const userColor = getRandomColor();
    socket.color = userColor;

    // Handle username setting
    socket.on('set username', (username) => {
        socket.username = sanitizeUsername(username) || "Anonymous"; 
        console.log(`Username set: ${socket.username}`);
    });

    // Handle chat messages
    socket.on('chat message', (message) => {
        const prefix = socket.username || "Anonymous";  
        const color = socket.color;  
        const timestamp = new Date().toLocaleTimeString(); 

        // Emit the message with the username, color, and timestamp to all clients
        io.emit('chat message', { prefix, message, color, timestamp });
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Chat server running on http://localhost:${PORT}`);
});
