const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

// Create the connection to MongoDB
const conn = mongoose.createConnection('mongodb://localhost:27017/hardwaredb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;
conn.once('open', () => {
  gfs = new GridFSBucket(conn.db, { bucketName: 'uploads' });
  
});




module.exports = gfs;
