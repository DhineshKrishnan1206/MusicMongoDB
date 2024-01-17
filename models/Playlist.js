
const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  userId:{
    type:String,
    required:true
  },
  name: {
    type: String,
    required: true,
  },
  image :{
    type:String,
  },
  songs:[{
        id:{type:String},
        name:{type:String},
        image:{type:String},
        url:{type:String},
    }]

});
playlistSchema.methods.addSong = function (songData) {
  this.songs.push(songData);
  return this.save();
};
const playlist = mongoose.model('playlist', playlistSchema);

module.exports = playlist;
