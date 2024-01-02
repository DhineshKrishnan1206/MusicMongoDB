const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const commentRoutes = require('./routes/commentRoutes')
const imageRoutes = require('./routes/imageRoutes');
const likeRoutes = require('./routes/likeRoutes');
const app =express()
app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const port = 3000;
mongoose.connect("mongodb+srv://user:user@music.jlnup7x.mongodb.net/Music?retryWrites=true&w=majority");

app.use('/api/comment',commentRoutes)
app.use('/api/playlist',playlistRoutes);
app.use('/api', userRoutes);
app.use('/images', imageRoutes);
app.use('/api',likeRoutes);
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Music API Server!</h1>');
  });
  
app.listen(port, ()=>{
    console.log(`Running on port ${port}`)
})