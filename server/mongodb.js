const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const uri = "mongodb://localhost:27017/hw_component";

const app = express();

app.use(cors());
async function connectToMongoDB() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB successfully!');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}
const nSchema  = new mongoose.Schema({
  Hwname: String,
  hwtype: String,
  HwUri: String,
})
const model = new mongoose.model('hwcomponents',nSchema)


connectToMongoDB();
const inputSchema = new mongoose.Schema({
  value: String,
});
const Input = mongoose.model('Input', inputSchema);
app.post('/inputs', async (req, res) => {
  const newInput = new Input({ value: req.body.value });
  try {
    await newInput.save();
    res.status(201).send(newInput);
  } catch (error) {
    res.status(400).send(error);
  }
});
app.post('/api/componets', async (req, res) => {
  const newCp = new Component({
    Hwname: req.body.name,
    hwtype: req.body.loai,
    HwUri: req.file ? req.file.path : ''
  });

  try {
    const savedCp = await newCp.save();
    
    
    const response = {
      Hwname: savedCp.Hwname,
      hwtype: savedCp.hwtype,
      HwUri: savedCp.HwUri,
  
    };

    res.status(201).json(response); 
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});





app.listen(5000, () => {
  console.log('Server listening on localhost');
});