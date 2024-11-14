const taikhoan = require('../Model/accounts');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');


const conn = mongoose.createConnection('mongodb://localhost:27017/hardwaredb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;
conn.once('open', () => {
  gfs = new GridFSBucket(conn.db, { bucketName: 'uploads' });
  console.log('GridFS initialized');
 
});








const signup = async (req, res) => {
    const { uname, email, password,PhoneNumber } = req.body;

    if (!uname) {
        return res.status(400).json({ message: 'Username is required' });
    }
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }
    try {
        const existingUser = await taikhoan.findOne({ Email: email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        } 
        const newtk = new taikhoan({
            Username: uname,
            Email: email,
            Password: password,
            urole: 1,
            Desc: ' ',
            PhoneNumber:PhoneNumber,
            followercount: 0,
            followingcount: 0,
            imgProfile: ' ',
        });
        await newtk.save();
        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
const signupPartner = async (req, res) => {
  const { uname, email, password,PhoneNumber } = req.body;

  if (!uname) {
      return res.status(400).json({ message: 'Username is required' });
  }
  if (!email) {
      return res.status(400).json({ message: 'Email is required' });
  }
  if (!password) {
      return res.status(400).json({ message: 'Password is required' });
  }
  if (!PhoneNumber) {
    return res.status(400).json({ message: 'phone number is required' });
}
  try {
      const existingUser = await taikhoan.findOne({ Email: email });
      if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
      } 
      const newtk = new taikhoan({
          Username: uname,
          Email: email,
          Password: password,
          urole: 2,
          Desc: ' ',
          PhoneNumber:PhoneNumber,
          followercount: 0,
          followingcount: 0,
          imgProfile: ' ',
      });
      await newtk.save();
      return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
  }
};


const login = async (req, res) => {
     const { uname, password } = req.body;

     if (!uname) {
        return res.status(400).json({ message: 'please input username' });
     }
     if (!password) {
        return res.status(400).json({ message: 'please input password' });
     }
     try {
        const document = await taikhoan.findOne({ Username: uname });
        if (document) {
            if (document.Password != password) {
                return res.status(400).json({ message: 'wrong user password' });
            }
          
            return res.send(document._id);
        }
     } catch (error) {
        console.log(error);
        return res.status(500).send(error);
     }
};

const getUserData = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'No user found' });
  }

  try {
    const document = await taikhoan.findOne({ Username: username });

    if (!document) {
      return res.status(404).json({ message: 'User not found' });
    }

    const formattedDocument = {
      ObjecID: document._id,
      Email: document.Email,
      urole: document.urole,
      Desc: document.Desc,
      PhoneNumber:document.PhoneNumber,
      followercount: document.followercount,
      followingcount: document.followingcount,
      imgProfile: document.imgProfile,
    };
   
    res.json(formattedDocument)
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getUserProfileImage = async (req, res) => {
  const { imgname } = req.query;
  console.log(imgname);

  if (!imgname) {
    return res.status(400).json({ message: 'No image found' });
  }

  if (!gfs) {
    return res.status(400).json({ message: 'No GFS' });
  }

  try {
    const files = await gfs.find({ filename: imgname }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No files available',
      });
    }

    const file = files[0];

    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      res.set('Content-Type', file.contentType);
      const downloadStream = gfs.openDownloadStreamByName(imgname);  // Corrected here
      downloadStream.pipe(res);
    } else {
      return res.status(400).json({ error: 'File is not an image' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};


const editProfile = async (req, res) => {
    const { username, email, desc } = req.body;
    console.log(username, email, desc);

    if (!username) {
        return res.status(400).json({ message: 'No username provided' });
    }

    try {
        const updatedUser = await taikhoan.findOneAndUpdate(
            { Username: username },  
            { $set: { Email: email, Desc: desc } },  
            { new: true }  
        );

        if (!updatedUser) {
            return res.status(400).json({ message: 'No user found' });
        }

        return res.status(200).json({ message: 'Data update successful', user: updatedUser });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating user data");
    }
};

const uploadProfile = async (req, res) => {
  const { username, email, desc } = req.body;
  const filename = req.file.filename;

  // Check for missing username or file
  if (!username) {
    return res.status(400).json({ message: 'No username provided' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
 
    const document = await taikhoan.findOneAndUpdate(
      { Username: username },
      { $set: { Email: email, Desc: desc, imgProfile: filename } },
      { new: true }
    );


    

    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user data");
  }
};


module.exports = { signup, login, getUserData, editProfile, uploadProfile, getUserProfileImage,signupPartner };
