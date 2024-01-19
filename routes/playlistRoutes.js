const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');

router.post('/create',async(req,res)=>{
    try {
        const {userId,name,image} = req.body;
        const newPlaylist = await Playlist.create({userId,name,image});
        return res.status(201).json({ status: true});
    } catch (error) {
        console.log(error);
    }
});
router.post('/get', async (req, res) => {
  try {
    const { userId } = req.body;
    const playlists = await Playlist.find({ userId });
    res.status(200).json({ status: true, playlists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: 'Internal Server Error' });
  }
});
router.post('/getByPlaylistId', async (req, res) => {
  try {
    const { playlistId } = req.body;

    // Validate if playlistId is provided
    if (!playlistId) {
      return res.status(400).json({ status: false, error: 'Playlist ID is required' });
    }

    // Find the playlist by ID
    const playlist = await Playlist.findById(playlistId);

    // Check if playlist with the provided ID exists
    if (playlist) {
      res.status(200).json({ status: true, playlist });
    } else {
      res.status(404).json({ status: false, error: 'Playlist not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: 'Internal Server Error' });
  }
});
  router.post('/addSong', async (req, res) => {
    try {
      const { playlistId, songData } = req.body;
  
      const playlist = await Playlist.findById(playlistId);
  
      if (playlist) {
        await playlist.addSong(songData);
        res.status(200).json({ status: true });
      } else {
        res.status(404).json({ status: false, error: 'Playlist not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
  });


module.exports = router;

