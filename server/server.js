// app.js
const express = require('express');
const mongoose = require('mongoose');
const accountRoutes = require('./routes/accountRoutes');
const routerOrder = require('./routes/OrderRoutes');
const PostRoutes = require('./routes/PostRoutes')
const routerReview = require('./routes/ReviewRoutes') ;
const cors = require('cors');

const app = express();
app.use(cors())
app.use(express.json());

app.use('/api/',PostRoutes)
app.use('/api/', accountRoutes);
app.use('/api/', routerOrder)
app.use('/api/', routerReview)

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/hardwaredb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));


  

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
