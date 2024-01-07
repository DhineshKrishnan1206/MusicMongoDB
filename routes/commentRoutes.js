const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

router.post('/create',async(req,res)=>{
    try {
        const {songId,username,cmttxt} = req.body;
        const newComment = await Comment.create({songId,username,cmttxt});
        return res.status(201).json({response:true});
    } catch (error) {
     console.log("Error while Creating Comments");   
    }
})
router.get('/get/:songId', async (req, res) => {
    try {
      const songId = req.params.songId;
      const comments = await Comment.find({ songId }); 
      return res.status(200).json({ response: true, comments });
    } catch (error) {
      console.log("Error while retrieving comments by userId", error);
      return res.status(500).json({ response: false, error: 'Internal Server Error' });
    }
  });
  router.delete('/delete/:_id/:username', async (req, res) => {
    try {
        const { _id, username } = req.params;
        console.log(`Deleting comment with _id ${_id} and username ${username}`);
        const deletedComment = await Comment.findOneAndDelete({ _id, username });

        if (!deletedComment) {
            return res.status(404).json({ response: false, error: 'Comment not found' });
        }

        return res.status(200).json({ response: true, message: 'Comment deleted successfully' });
    } catch (error) {
        console.log("Error while deleting comment", error);
        return res.status(500).json({ response: false, error: 'Internal Server Error' });
    }
});
module.exports = router;