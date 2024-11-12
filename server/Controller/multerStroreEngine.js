const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');


const storage = new GridFsStorage({
    url: 'mongodb://localhost:27017/yourDatabase', 
    file: (req, file) => {
      return {
        bucketName: 'uploads', 
        filename: file.originalname, // File name to store in GridFS
      };
    },
  });
const upload = multer({ storage });

module.exports = upload;