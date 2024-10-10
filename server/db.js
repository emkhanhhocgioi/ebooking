const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');


const mongoURI = 'mongodb://localhost:27017/hardwaredb'; 

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Component schema and model
const componentSchema = new mongoose.Schema({
    
    componentName: { type: String, required: true },  
    componentType: { type: String, required: true },  
    images: [{
      name: { type: String, required: true, unique: true }, 
      data: { type: String, required: true },  
      contentType: { type: String, required: true },  
    }]
});

const Component = mongoose.model('Component', componentSchema);


const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

//insert
app.post('/inputs', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file provided.' });
    }

    const base64Image = req.file.buffer.toString('base64');
    const hw = new Component({
        
        componentName: req.body.componentName,
        componentType: req.body.componentType,
        images: [{
            name: req.file.originalname,
            data: base64Image,
            contentType: req.file.mimetype,
        }]
    });

    try {
        await hw.save();
        return res.status(201).json({
            success: true,
            message: 'Component with image created successfully.',
        });
    } catch (error) {
        console.error('Error saving component:', error);
        return res.status(400).json({ success: false, message: error.message });
    }
});

//insert backup
app.post('/insert-hardware', async (req, res) => {
    const { name, type, imageUrl } = req.body;

    if (!name || !type || !imageUrl) {
        return res.status(400).json({ message: 'Name, type, and image URL are required.' });
    }

    try {
        const newHardware = new Component({ componentName: name, componentType: type, images: [{ name: 'URL Image', data: null, contentType: 'url', imageUrl }] });
        await newHardware.save();
        console.log('New hardware added:', newHardware);
        return res.status(201).json({ message: 'Hardware inserted successfully!' });
    } catch (error) {
        console.error('Error inserting hardware:', error);
        return res.status(500).json({ message: 'Error inserting hardware.' });
    }
});
//fetching data
app.get('/outputs', async (req, res) => {
    try {
        const documents = await Component.find();
        const formattedDocuments = documents.map(doc => ({
            componentID :doc._id,
            componentName: doc.componentName,
            componentType: doc.componentType,
            images: doc.images.map(image => ({
                name: image.name,
                data: image.data, 
                contentType: image.contentType,
            })),
        }));
        res.json(formattedDocuments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching the documents.' });
    }
});

app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid Object ID format");
        }

        const deletedComponent = await Component.findByIdAndDelete(id);

        if (deletedComponent) {
            console.log("Delete from database successful");
            res.status(200).send("Component deleted successfully");
        } else {
            res.status(404).send("Component not found");
        }
    } catch (err) {
        console.log(err); 
        res.status(500).send("Error deleting component");
    }
});
app.get('/getdata/:id', async (req, res) => {
    const { id } = req.params;

    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid Object ID format");
    }

    try {
       
        const document = await Component.findById(id);
        
     
        if (!document) {
            return res.status(404).send("Component not found");
        }

     
        const formattedDocument = {
            componentID: document._id,
            componentName: document.componentName,
            componentType: document.componentType,
            images: document.images.map(image => ({
                name: image.name,
                data: image.data, 
                contentType: image.contentType,
            })),
        };

        
        res.json(formattedDocument);

    } catch (err) {
        console.log(err);
        res.status(500).send("Error retrieving component");
    }
});
app.post('/update/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;

   
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file provided.' });
    }

  
    const base64Image = req.file.buffer.toString('base64');

    try {
       
        const updatedDocument = await Component.findOneAndUpdate(
            { _id: id },
            {
                componentName: req.body.componentName,
                componentType: req.body.componentType,
                images: [{
                    name: req.file.originalname,
                    data: base64Image,
                    contentType: req.file.mimetype,
                }]
            },
            { new: true } 
        );

     
        if (!updatedDocument) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }

        
        res.status(200).json({
            success: true,
            message: 'Document updated successfully',
            document: updatedDocument
        });
    } catch (err) {
        console.error('Error updating document:', err);
        res.status(500).json({ success: false, message: 'Failed to update document', error: err.message });
    }
});
const accountSchema = new mongoose.Schema({
    username: { type: String, required: true },  
    password: { type: String, required: true },  
});

const accountmd = mongoose.model('accounts', accountSchema);

app.get('/login/:username', async (req, res) => {
    const { username } = req.params;  
    
    try {
       
        const document = await accountmd.findOne({ username: username });
        
        if (!document) {
          
            return res.status(404).json({ message: "User not found" });
        }

        
        const formattedDocument = {
            username: document.username, 
            password: document.password  
        };

      
        res.json(formattedDocument);
    } catch (error) {
       
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
