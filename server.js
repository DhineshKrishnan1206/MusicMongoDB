const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const commentRoutes = require('./routes/commentRoutes');
const imageRoutes = require('./routes/imageRoutes');
const likeRoutes = require('./routes/likeRoutes');
const fs = require('fs');
const https = require('https');
const http = require('http'); // Import the http module

const privateKey = fs.readFileSync('./private-key.pem', 'utf8');
const certificate = fs.readFileSync('./certificate.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const portHTTP = 3001; // Port for HTTP
const portHTTPS = 3000; // Port for HTTPS

mongoose.connect("mongodb+srv://user:user@music.jlnup7x.mongodb.net/Music?retryWrites=true&w=majority");

app.use('/api/comment', commentRoutes);
app.use('/api/playlist', playlistRoutes);
app.use('/api', userRoutes);
app.use('/images', imageRoutes);
app.use('/api', likeRoutes);

app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Music API Server!</h1>');
});

// Create HTTP server
const httpServer = http.createServer(app);

// Create HTTPS server
const httpsServer = https.createServer(credentials, app);

// Listen on both HTTP and HTTPS ports
httpServer.listen(portHTTP, () => {
    console.log(`Running on port ${portHTTP} (HTTP)`);
});

httpsServer.listen(portHTTPS, () => {
    console.log(`Running on port ${portHTTPS} (HTTPS)`);
});
const dummyRequestInterval = 14 * 60 * 1000; // 14 minutes in milliseconds
setInterval(() => {
    // You can make a dummy request here to any endpoint of your API
    // For example, making a request to the root endpoint
    http.get(`http://localhost:${portHTTP}`, (res) => {
        console.log(`Dummy request sent at ${new Date()}`);
    }).on('error', (err) => {
        console.error(`Error sending dummy request: ${err.message}`);
    });
}, dummyRequestInterval);