
const taikhoan = require('../Model/accounts')

const signup = async (req, res) => {
    const { uname, email, password } = req.body;

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
        // Check if the user already exists
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

const signupHotel = async (req, res) => {
    const { uname, email, password } = req.body;

    if (!uname || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const existingUser = await taikhoan.findOne({ Email: email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        } else {
            const newHotel = new taikhoan({
                Username: uname,
                Email: email,
                Password: password,
                urole: 2,
                Desc: ' ',
                followercount: 0,
                followingcount: 0,
                imgProfile: ' ',
            });
            await newHotel.save();
            return res.status(201).json({
                success: true,
                message: 'Account created successfully',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res)=> {
     const {uname,password} = req.body;

     if(!uname){
        return res.status(400).json({message:'please input username'})
     }
     if(!password){
        return res.status(400).json({message:'please input password'})
     }
     try {
        const document = await  taikhoan.findOne({Username:uname});
        if(document){

            if(document.Password !=password){
                return res.status(400).json({message:'wrong user password'+document.Password})
               
            }
            return res.send('Login success');
        }
     } catch (error) {
        console.log(error)
        return res.status(500).send(error);
     }
}
const getUserData = async (req, res) => {
    const { username } = req.query; 
    console.log(username);
  
    if (!username) {
      return res.status(400).json({ message: 'No user found' });
    }
  
    try {
      const document = await taikhoan.findOne({ Username: username });
  
      if (document) {
        const formattedDocument = {
          Email: document.Email,
          urole: document.urole,
          Desc: document.Desc,
          followercount: document.followercount,
          followingcount: document.followingcount,
          imgProfile: document.imgProfile,
        };
        res.json(formattedDocument);
      } else {
        res.status(404).send({ message: 'User not found' });
      }
    } catch (error) {
      console.log('Error retrieving user data:', error);
      res.status(500).send("Error retrieving user data");
    }
  };

  const editProfile = async (req, res) => {
    const { username, email, desc } = req.body;
    console.log(username,email,desc);

    if (!username) {
        return res.status(400).json({ message: 'No username provided' });
    }

    try {
   
        const updatedUser = await taikhoan.findOneAndUpdate(
            { Username: username },  
            { $set: { Email: email, Desc: desc } },  
            { new: true }  
        );

        // If no document was found, return an error
        if (!updatedUser) {
            return res.status(400).json({ message: 'No user found' });
        }

        // Return success message along with the updated data
        return res.status(200).json({ message: 'Data update successful', user: updatedUser });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating user data");
    }
};



  

module.exports = { signup, signupHotel,login,getUserData,editProfile };
